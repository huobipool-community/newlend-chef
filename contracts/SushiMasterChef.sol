// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/ISushiFactory.sol";
import "./interface/ISushiPair.sol";
import "./interface/IWETH.sol";
import "./interface/ISushiChef.sol";
import "./library/TransferHelper.sol";
import "./library/SushiSwapLibrary.sol";

// MasterChef is the master of Hpt. He can make Hpt and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once HPT is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract MasterChef is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        uint256 sushiRewardDebt;
    }
    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken; // Address of LP token contract.
        uint256 allocPoint; // How many allocation points assigned to this pool. HPTs to distribute per block.
        uint256 lastRewardBlock; // Last block number that HPTs distribution occurs.
        uint256 accHptPerShare; // Accumulated HPTs per share, times 1e12. See below.
        uint256 sushiChefPid;
        uint256 lpBalance;
        uint256 accSushiPerShare;
    }

    // The HPT TOKEN!
    IERC20 public hpt;
    // HPT tokens created per block.
    uint256 public hptPerBlock;
    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    // Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when HPT mining starts.
    uint256 public startBlock;
    uint256 public hptRewardBalance;
    uint256 public sushiRewardBalance;
    uint256 public hptRewardTotal;
    uint256 public sushiRewardTotal;
    address public factory;
    address public WETH;
    ISushiChef public sushiChef;
    uint256 public sushiProfitRate;
    IERC20 public sushi;
    uint256 one = 1e18;
    address public treasuryAddress;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    event AmtNotEnoughSend(
        address indexed user,
        address currency,
        uint256 shouldAmt,
        uint256 actAmt
    );

    constructor(
        IERC20 _hpt,
        uint256 _hptPerBlock,
        uint256 _startBlock,
        address _sushiFactory,
        address _WETH,
        ISushiChef _sushiChef,
        uint256 _sushiProfitRate,
        IERC20 _sushi,
        address _treasuryAddress
    ) public {
        hpt = _hpt;
        hptPerBlock = _hptPerBlock;
        startBlock = _startBlock;
        factory = _sushiFactory;
        WETH = _WETH;
        sushiChef = _sushiChef;
        sushiProfitRate = _sushiProfitRate;
        sushi = _sushi;
        treasuryAddress = _treasuryAddress;
    }

    function setTreasuryAddress(address _treasuryAddress) public onlyOwner {
        treasuryAddress = _treasuryAddress;
    }

    function setHptPerBlock(uint _hptPerBlock) public onlyOwner {
        massUpdatePools();
        hptPerBlock = _hptPerBlock;
    }

    function sushiRewardPerBlock(uint256 _pid) external view returns(uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        uint256 sushiTotalAllocPoint = sushiChef.totalAllocPoint();
        ISushiChef.SushiPoolInfo memory sushiPoolInfo = sushiChef.poolInfo(pool.sushiChefPid);
        uint totalAmount = sushiPoolInfo.lpToken.balanceOf(address(sushiChef));

        uint256 sushiPerBlock = sushiChef.sushiPerBlock().mul(sushiPoolInfo.allocPoint).div(sushiTotalAllocPoint);
        sushiPerBlock = sushiPerBlock.mul(pool.lpBalance).div(totalAmount);
        sushiPerBlock = sushiPerBlock.mul(one.sub(sushiProfitRate)).div(one);
        return sushiPerBlock;
    }

    function hptRewardPerBlock(uint _pid) external view returns(uint)  {
        PoolInfo storage pool = poolInfo[_pid];
        return hptPerBlock.mul(pool.allocPoint).div(totalAllocPoint);
    }

    function setSushiProfitRate(uint _sushiProfitRate) public onlyOwner {
        massUpdatePools();
        sushiProfitRate = _sushiProfitRate;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    function revoke() public onlyOwner {
        hpt.transfer(msg.sender, hpt.balanceOf(address(this)));
        //sushi.transfer(msg.sender, sushi.balanceOf(address(this)));
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(
        uint256 _allocPoint,
        IERC20 _lpToken,
        uint _sushiChefPid
    ) public onlyOwner {
        massUpdatePools();
        uint256 lastRewardBlock =
        block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(
            PoolInfo({
            lpToken: _lpToken,
            allocPoint: _allocPoint,
            lastRewardBlock: lastRewardBlock,
            accHptPerShare: 0,
            sushiChefPid: _sushiChefPid,
            lpBalance: 0,
            accSushiPerShare: 0
            })
        );
    }

    // Update the given pool's HPT allocation point. Can only be called by the owner.
    function set(
        uint256 _pid,
        uint256 _allocPoint,
        uint _sushiChefPid
    ) public onlyOwner {
        massUpdatePools();
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(
            _allocPoint
        );
        poolInfo[_pid].allocPoint = _allocPoint;
        poolInfo[_pid].sushiChefPid = _sushiChefPid;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to)
    public
    pure
    returns (uint256)
    {
        return _to.sub(_from);
    }

    // View function to see pending HPTs on frontend.
    function pendingHpt(uint256 _pid, address _user)
    external
    view
    returns (uint256)
    {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accHptPerShare = pool.accHptPerShare;
        uint256 lpSupply = pool.lpBalance;
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier =
            getMultiplier(pool.lastRewardBlock, block.number);
            uint256 hptReward =
            multiplier.mul(hptPerBlock).mul(pool.allocPoint).div(
                totalAllocPoint
            );
            accHptPerShare = accHptPerShare.add(
                hptReward.mul(1e12).div(lpSupply)
            );
        }
        return user.amount.mul(accHptPerShare).div(1e12).sub(user.rewardDebt);
    }

    // View function to see pending HPTs on frontend.
    function pendingSushi(uint256 _pid, address _user)
    external
    view
    returns (uint256)
    {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accSushiPerShare = pool.accSushiPerShare;
        uint256 lpSupply = pool.lpBalance;
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 sushiReward = sushiChef.pendingSushi(pool.sushiChefPid, address(this));
            accSushiPerShare = accSushiPerShare.add(
                sushiReward.mul(1e12).div(lpSupply)
            );
        }
        return user.amount.mul(accSushiPerShare).div(1e12).sub(user.sushiRewardDebt);
    }

    // Update reward vairables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpBalance;
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 hptReward =
        multiplier.mul(hptPerBlock).mul(pool.allocPoint).div(
            totalAllocPoint
        );
        hptRewardBalance = hptRewardBalance.add(hptReward);
        hptRewardTotal = hptRewardTotal.add(hptReward);
        pool.accHptPerShare = pool.accHptPerShare.add(
            hptReward.mul(1e12).div(lpSupply)
        );

        //claim reward
        uint256 sushiBalancePrior = sushi.balanceOf(address(this));
        sushiChef.withdraw(pool.sushiChefPid, 0);
        uint256 sushiBalanceNew = sushi.balanceOf(address(this));
        if (sushiBalanceNew > sushiBalancePrior) {
            uint256 delta = sushiBalanceNew.sub(sushiBalancePrior);
            //keep profit to owner by sushiProfitRate
            uint256 sushiProfit = delta.mul(sushiProfitRate).div(one);
            sushi.transfer(treasuryAddress, sushiProfit);

            uint256 sushiReward = delta.sub(sushiProfit);
            sushiRewardBalance = sushiRewardBalance.add(sushiReward);
            sushiRewardTotal = sushiRewardTotal.add(sushiReward);
            pool.accSushiPerShare = pool.accSushiPerShare.add(
                sushiReward.mul(1e12).div(lpSupply)
            );
        }

        pool.lastRewardBlock = block.number;
    }

    function depositTokens(uint256 _pid,
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin) public {
        uint _amount;
        address pair = getPair(tokenA, tokenB);
        PoolInfo storage pool = poolInfo[_pid];
        require(pair == address(pool.lpToken), "wrong pid");
        updatePool(_pid);
        if (amountADesired != 0) {
            (, , _amount) = addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, address(this));
            pool.lpToken.approve(address(sushiChef), _amount);
            sushiChef.deposit(pool.sushiChefPid, _amount);
        }
        deposit(_pid, _amount);
    }

    function depositETH(uint256 _pid,
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin) public payable {
        uint _amount;
        address pair = getPair(token, WETH);
        PoolInfo storage pool = poolInfo[_pid];
        require(pair == address(pool.lpToken), "wrong pid");
        updatePool(_pid);
        if (amountTokenDesired != 0) {
            (, , _amount) = addLiquidityETH(token, amountTokenDesired, amountTokenMin, amountETHMin, address(this));
            pool.lpToken.approve(address(sushiChef), _amount);
            sushiChef.deposit(pool.sushiChefPid, _amount);
        }
        deposit(_pid, _amount);
    }

    // Deposit LP tokens to MasterChef for HPT allocation.
    function deposit(uint256 _pid, uint256 _amount) internal {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        if (user.amount > 0) {
            // reward hpt
            uint256 hptPending =
            user.amount.mul(pool.accHptPerShare).div(1e12).sub(
                user.rewardDebt
            );
            safeHptTransfer(msg.sender, hptPending);

            // reward sushi
            uint256 sushiPending =
            user.amount.mul(pool.accSushiPerShare).div(1e12).sub(
                user.sushiRewardDebt
            );
            safeSushiTransfer(msg.sender, sushiPending);
        }
        pool.lpBalance = pool.lpBalance.add(_amount);
        user.amount = user.amount.add(_amount);
        user.rewardDebt = user.amount.mul(pool.accHptPerShare).div(1e12);
        user.sushiRewardDebt = user.amount.mul(pool.accSushiPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    function withdrawTokens(uint256 _pid,
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin) public {
        address pair = getPair(tokenA, tokenB);
        PoolInfo storage pool = poolInfo[_pid];
        require(pair == address(pool.lpToken), "wrong pid");
        updatePool(_pid);
        withdraw(_pid, liquidity);
        if (liquidity != 0) {
            sushiChef.withdraw(pool.sushiChefPid, liquidity);
            removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, msg.sender);
        }
    }

    function withdrawETH(uint256 _pid,
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin) public {
        address pair = getPair(token, WETH);
        PoolInfo storage pool = poolInfo[_pid];
        require(pair == address(pool.lpToken), "wrong pid");
        updatePool(_pid);
        withdraw(_pid, liquidity);
        if (liquidity != 0) {
            sushiChef.withdraw(pool.sushiChefPid, liquidity);
            uint amountToken;
            uint amountETH;
            (amountToken, amountETH) = removeLiquidity(token, WETH, liquidity, amountTokenMin, amountETHMin, address(this));
            TransferHelper.safeTransfer(token, msg.sender, amountToken);
            IWETH(WETH).withdraw(amountETH);
            TransferHelper.safeTransferETH(msg.sender, amountETH);
        }
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) internal {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");

        // reward hpt
        uint256 pending =
        user.amount.mul(pool.accHptPerShare).div(1e12).sub(
            user.rewardDebt
        );
        safeHptTransfer(msg.sender, pending);

        // reward sushi
        uint256 sushiPending =
        user.amount.mul(pool.accSushiPerShare).div(1e12).sub(
            user.sushiRewardDebt
        );
        safeSushiTransfer(msg.sender, sushiPending);

        pool.lpBalance = pool.lpBalance.sub(_amount);
        user.amount = user.amount.sub(_amount);
        user.rewardDebt = user.amount.mul(pool.accHptPerShare).div(1e12);
        user.sushiRewardDebt = user.amount.mul(pool.accSushiPerShare).div(1e12);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdrawTokens(uint256 _pid,
        address tokenA,
        address tokenB,
        uint amountAMin,
        uint amountBMin) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        address pair = getPair(tokenA, tokenB);
        require(pair == address(pool.lpToken), "wrong pid");
        updatePool(_pid);

        sushiChef.withdraw(pool.sushiChefPid, user.amount);
        removeLiquidity(tokenA, tokenB, user.amount, amountAMin, amountBMin, msg.sender);

        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        pool.lpBalance = pool.lpBalance.sub(user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
        user.sushiRewardDebt = 0;
    }

    function emergencyWithdrawETH(uint256 _pid,
        address token,
        uint amountTokenMin,
        uint amountETHMin) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        address pair = getPair(token, WETH);
        require(pair == address(pool.lpToken), "wrong pid");
        updatePool(_pid);

        sushiChef.withdraw(pool.sushiChefPid, user.amount);
        uint amountToken;
        uint amountETH;
        (amountToken, amountETH) = removeLiquidity(token, WETH, user.amount, amountTokenMin, amountETHMin, address(this));
        TransferHelper.safeTransfer(token, msg.sender, amountToken);
        IWETH(WETH).withdraw(amountETH);

        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        pool.lpBalance = pool.lpBalance.sub(user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
        user.sushiRewardDebt = 0;

        TransferHelper.safeTransferETH(msg.sender, amountETH);
    }

    function safeHptTransfer(address _to, uint256 _amount) internal {
        hptRewardBalance = hptRewardBalance.sub(_amount);
        uint256 hptBal = hpt.balanceOf(address(this));
        if (_amount > hptBal) {
            hpt.transfer(_to, hptBal);
            emit AmtNotEnoughSend(_to, address(hpt), _amount, hptBal);
        } else {
            hpt.transfer(_to, _amount);
        }
    }

    function safeSushiTransfer(address _to, uint256 _amount) internal {
        sushiRewardBalance = sushiRewardBalance.sub(_amount);
        uint256 sushiBal = sushi.balanceOf(address(this));
        if (_amount > sushiBal) {
            sushi.transfer(_to, sushiBal);
            emit AmtNotEnoughSend(_to, address(sushi), _amount, sushiBal);
        } else {
            sushi.transfer(_to, _amount);
        }
    }

    function getPair(address tokenA, address tokenB) internal view returns (address pair){
        pair = ISushiFactory(factory).getPair(tokenA, tokenB);
    }

    // **** ADD LIQUIDITY ****
    function _addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin
    ) internal view returns (uint amountA, uint amountB) {
        (uint reserveA, uint reserveB) = SushiSwapLibrary.getReserves(factory, tokenA, tokenB);
        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint amountBOptimal = SushiSwapLibrary.quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, 'Router: INSUFFICIENT_B_AMOUNT');
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint amountAOptimal = SushiSwapLibrary.quote(amountBDesired, reserveB, reserveA);
                assert(amountAOptimal <= amountADesired);
                require(amountAOptimal >= amountAMin, 'Router: INSUFFICIENT_A_AMOUNT');
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to
    ) internal returns (uint amountA, uint amountB, uint liquidity) {
        (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);
        address pair = getPair(tokenA, tokenB);
        TransferHelper.safeTransferFrom(tokenA, msg.sender, pair, amountA);
        TransferHelper.safeTransferFrom(tokenB, msg.sender, pair, amountB);
        liquidity = ISushiPair(pair).mint(to);
    }

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to
    ) internal returns (uint amountToken, uint amountETH, uint liquidity) {
        (amountToken, amountETH) = _addLiquidity(
            token,
            WETH,
            amountTokenDesired,
            msg.value,
            amountTokenMin,
            amountETHMin
        );
        address pair = getPair(token, WETH);
        TransferHelper.safeTransferFrom(token, msg.sender, pair, amountToken);
        IWETH(WETH).deposit{value : amountETH}();
        assert(IWETH(WETH).transfer(pair, amountETH));
        liquidity = ISushiPair(pair).mint(to);
        // refund dust eth, if any
        if (msg.value > amountETH) TransferHelper.safeTransferETH(msg.sender, msg.value - amountETH);
    }

    // **** REMOVE LIQUIDITY ****
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to
    ) internal returns (uint amountA, uint amountB) {
        address pair = getPair(tokenA, tokenB);
        ISushiPair(pair).transfer(pair, liquidity);
        // send liquidity to pair
        (uint amount0, uint amount1) = ISushiPair(pair).burn(to);
        (address token0,) = SushiSwapLibrary.sortTokens(tokenA, tokenB);
        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
        require(amountA >= amountAMin, 'Router: INSUFFICIENT_A_AMOUNT');
        require(amountB >= amountBMin, 'Router: INSUFFICIENT_B_AMOUNT');
    }

    fallback() external {}
    receive() payable external {}
}
