let {run, ethQuery1, ethBatchQuery, tokenMap} = require('jsir')
let Web3 = require('web3');
let web3 = new Web3("https://http-mainnet.hecochain.com");
require('console.table')

let tenBankHall = '0xa61A4F9275eF62d2C076B0933F8A9418CeC8c670'
let tenBankHallAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_boxid","type":"uint256"},{"indexed":false,"internalType":"address","name":"_safebox","type":"address"}],"name":"AddBox","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_sid","type":"uint256"},{"indexed":true,"internalType":"address","name":"_strategylink","type":"address"},{"indexed":true,"internalType":"uint256","name":"_pid","type":"uint256"},{"indexed":false,"internalType":"bool","name":"_blisted","type":"bool"}],"name":"AddStrategy","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_account","type":"address"},{"indexed":false,"internalType":"bool","name":"_newset","type":"bool"}],"name":"SetBlacklist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_boxid","type":"uint256"},{"indexed":false,"internalType":"bool","name":"_listed","type":"bool"}],"name":"SetBoxListed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_sid","type":"uint256"},{"indexed":false,"internalType":"bool","name":"_newset","type":"bool"}],"name":"SetEmergencyEnabled","type":"event"},{"inputs":[{"internalType":"address","name":"_safebox","type":"address"}],"name":"addBox","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_poolClaim","type":"address"}],"name":"addClaimPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_strategylink","type":"address"},{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"bool","name":"_blisted","type":"bool"}],"name":"addStrategy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"blacklist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"boxIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"boxInfo","outputs":[{"internalType":"contract ISafeBox","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"boxesLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"boxlisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolClaimId","type":"uint256"},{"internalType":"uint256[]","name":"_pidlist","type":"uint256[]"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"uint256[]","name":"_amount","type":"uint256[]"},{"internalType":"uint256","name":"_bid","type":"uint256"},{"internalType":"uint256","name":"_bAmount","type":"uint256"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"}],"name":"deposit","outputs":[{"internalType":"uint256","name":"lpAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_bid","type":"uint256"},{"internalType":"uint256","name":"_bAmount","type":"uint256"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"}],"name":"depositLPToken","outputs":[{"internalType":"uint256","name":"lpAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"emergencyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"}],"name":"getBorrowAmount","outputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"}],"name":"getDepositAmount","outputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_maxDebt","type":"uint256"}],"name":"liquidation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"},{"internalType":"address","name":"_borrowFrom","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"makeBorrowFrom","outputs":[{"internalType":"uint256","name":"bid","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolClaim","outputs":[{"internalType":"contract IClaimFromBank","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"bool","name":"_newset","type":"bool"}],"name":"setBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_boxid","type":"uint256"},{"internalType":"bool","name":"_listed","type":"bool"}],"name":"setBoxListed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"bool","name":"_newset","type":"bool"}],"name":"setEmergencyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"bool","name":"_listed","type":"bool"}],"name":"setStrategyListed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"strategyIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"strategyInfo","outputs":[{"internalType":"bool","name":"isListed","type":"bool"},{"internalType":"contract IStrategyLink","name":"iLink","type":"address"},{"internalType":"uint256","name":"pid","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"strategyInfoLength","outputs":[{"internalType":"uint256","name":"length","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"}],"name":"strategyIsListed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"uint256","name":"_rate","type":"uint256"},{"internalType":"address","name":"_toToken","type":"address"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"uint256","name":"_rate","type":"uint256"},{"internalType":"address","name":"_toToken","type":"address"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"},{"internalType":"uint256","name":"_poolClaimId","type":"uint256"},{"internalType":"uint256[]","name":"_pidlist","type":"uint256[]"}],"name":"withdrawAndClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"uint256","name":"_rate","type":"uint256"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"}],"name":"withdrawLPToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_sid","type":"uint256"},{"internalType":"uint256","name":"_rate","type":"uint256"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"},{"internalType":"uint256","name":"_poolClaimId","type":"uint256"},{"internalType":"uint256[]","name":"_pidlist","type":"uint256[]"}],"name":"withdrawLPTokenAndClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
let strategyAbi = [{"inputs":[{"internalType":"address","name":"_bank","type":"address"},{"internalType":"address","name":"_sconfig","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_poolId","type":"uint256"},{"indexed":false,"internalType":"address","name":"lpToken","type":"address"},{"indexed":false,"internalType":"address","name":"_baseToken","type":"address"}],"name":"AddPool","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_old","type":"address"},{"indexed":false,"internalType":"address","name":"_new","type":"address"}],"name":"SetCompAcionPool","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_miniRewardAmount","type":"uint256"}],"name":"SetMiniRewardAmount","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_oldv","type":"address"},{"indexed":false,"internalType":"address","name":"_new","type":"address"}],"name":"SetPriceChecker","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_old","type":"address"},{"indexed":false,"internalType":"address","name":"_new","type":"address"}],"name":"SetSConfig","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"strategy","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"borrowAmount","type":"uint256"}],"name":"StrategyBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"strategy","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"borrowAmount","type":"uint256"}],"name":"StrategyDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"strategy","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"StrategyLiquidation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"strategy","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"StrategyWithdraw","type":"event"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"},{"internalType":"address[]","name":"_collateralToken","type":"address[]"},{"internalType":"address","name":"_baseToken","type":"address"}],"name":"addPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"bank","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buyback","outputs":[{"internalType":"contract IBuyback","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"compActionPool","outputs":[{"internalType":"contract IActionPools","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"},{"internalType":"address","name":"_borrowFrom","type":"address"},{"internalType":"uint256","name":"_bAmount","type":"uint256"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"}],"name":"deposit","outputs":[{"internalType":"uint256","name":"lpAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"},{"internalType":"address","name":"_borrowFrom","type":"address"},{"internalType":"uint256","name":"_bAmount","type":"uint256"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"}],"name":"depositLPToken","outputs":[{"internalType":"uint256","name":"lpAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"getBaseToken","outputs":[{"internalType":"address","name":"baseToken","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"}],"name":"getBorrowAmount","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"}],"name":"getBorrowAmountInBaseToken","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"}],"name":"getBorrowInfo","outputs":[{"internalType":"address","name":"borrowFrom","type":"address"},{"internalType":"uint256","name":"bid","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"getCATPoolInfo","outputs":[{"internalType":"address","name":"lpToken","type":"address"},{"internalType":"uint256","name":"allocRate","type":"uint256"},{"internalType":"uint256","name":"totalPoints","type":"uint256"},{"internalType":"uint256","name":"totalAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"}],"name":"getCATUserAmount","outputs":[{"internalType":"uint256","name":"lpPoints","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"}],"name":"getDepositAmount","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"getPoolCollateralToken","outputs":[{"internalType":"address[]","name":"collateralToken","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"getPoolInfo","outputs":[{"internalType":"address[]","name":"collateralToken","type":"address[]"},{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"lpToken","type":"address"},{"internalType":"uint256","name":"poolId","type":"uint256"},{"internalType":"uint256","name":"totalLPAmount","type":"uint256"},{"internalType":"uint256","name":"totalLPReinvest","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"getPoollpToken","outputs":[{"internalType":"address","name":"lpToken","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSource","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hecopool","outputs":[{"internalType":"contract IMdexHecoPool","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"},{"internalType":"address","name":"_hunter","type":"address"},{"internalType":"uint256","name":"_maxDebt","type":"uint256"}],"name":"liquidation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"makeExtraRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"}],"name":"makeWithdrawCalcAmount","outputs":[{"internalType":"uint256","name":"withdrawLPTokenAmount","type":"uint256"},{"internalType":"uint256","name":"rewardsRate","type":"uint256"},{"internalType":"uint256","name":"borrowRate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mdxToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"}],"name":"pendingLPAmount","outputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"}],"name":"pendingRewards","outputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"poolDepositToken","outputs":[{"internalType":"address","name":"lpToken","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"contract IMdexPair","name":"lpToken","type":"address"},{"internalType":"uint256","name":"poolId","type":"uint256"},{"internalType":"uint256","name":"lastRewardsBlock","type":"uint256"},{"internalType":"uint256","name":"totalPoints","type":"uint256"},{"internalType":"uint256","name":"totalLPAmount","type":"uint256"},{"internalType":"uint256","name":"totalLPReinvest","type":"uint256"},{"internalType":"uint256","name":"miniRewardAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"poolPending","outputs":[{"internalType":"uint256","name":"rewards","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"poolRewardToken","outputs":[{"internalType":"address","name":"rewardToken","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"priceChecker","outputs":[{"internalType":"contract IPriceChecker","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_rate","type":"uint256"},{"internalType":"bool","name":"_force","type":"bool"}],"name":"repayBorrow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"resetApprove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_buyback","type":"address"}],"name":"setBuyback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_compactionPool","type":"address"}],"name":"setCompAcionPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_miniRewardAmount","type":"uint256"}],"name":"setMiniRewardAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_priceChecker","type":"address"}],"name":"setPriceChecker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_sconfig","type":"address"}],"name":"setSConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"lpAmount","type":"uint256"},{"internalType":"uint256","name":"lpPoints","type":"uint256"},{"internalType":"address","name":"borrowFrom","type":"address"},{"internalType":"uint256","name":"bid","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"utils","outputs":[{"internalType":"contract StrategyUtils","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_rate","type":"uint256"},{"internalType":"address","name":"_toToken","type":"address"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_rate","type":"uint256"},{"internalType":"uint256","name":"_desirePrice","type":"uint256"},{"internalType":"uint256","name":"_slippage","type":"uint256"}],"name":"withdrawLPToken","outputs":[],"stateMutability":"nonpayable","type":"function"}]
let pairAbi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"baseDecimal","type":"uint256"}],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
run(async () => {
    let strategyLens = await ethQuery1(web3, tenBankHall, tenBankHallAbi, 'strategyInfoLength')

    let queryItems = []
    for(let i = 0; i<strategyLens;i++) {
        queryItems.push({
            address: tenBankHall,
            abi: tenBankHallAbi,
            name: 'strategyInfo',
            params: [i]
        })
    }
    let results = await ethBatchQuery(queryItems, web3)
    queryItems = []
    let pools = []
    for (let i = 0; i < results.length; i++) {
        let item = results[i]
        queryItems.push({
            address: item.iLink,
            abi: strategyAbi,
            name: 'getPoolInfo',
            params: [item.pid]
        })
        pools.push({
            sid: i,
            iLink: item.iLink,
            pid: item.pid.toString()
        })
    }

    results = await ethBatchQuery(queryItems, web3)
    queryItems = []
    for (let i = 0; i < results.length ; i++) {
        let result = results[i]
        let pool = pools[i]
        let baseTokenSymbol = (await tokenMap(result.baseToken, web3)).symbol
        pool.baseToken = `[${baseTokenSymbol}] ${result.baseToken}`
        pool.lpToken = result.lpToken
        pool.dexPid = result.poolId.toString()

        queryItems.push({
            address: pool.lpToken,
            abi: pairAbi,
            name: 'token0'
        })
        queryItems.push({
            address: pool.lpToken,
            abi: pairAbi,
            name: 'token1'
        })
        queryItems.push({
            address: pool.lpToken,
            abi: pairAbi,
            name: 'name'
        })
    }

    results = await ethBatchQuery(queryItems, web3)
    for (let i = 0; i < pools.length; i++) {
        let pool = pools[i]
        pool.token0 = results[i * 3][0]
        pool.token1 = results[i * 3 + 1][0]
        let name = results[i * 3 + 2][0]
        let token0Symbol = (await tokenMap(pool.token0, web3)).symbol
        let token1Symbol = (await tokenMap(pool.token1, web3)).symbol

        pool.token0 = `[${token0Symbol}] ${pool.token0}`
        pool.token1 = `[${token1Symbol}] ${pool.token1}`
        let pairKey = `${token0Symbol}-${token1Symbol}`
        pool.lpToken = `[${pairKey}] ${pool.lpToken}`
        pool.dexPid = `[${name}] ${pool.dexPid}`
    }
    console.table(pools)
})