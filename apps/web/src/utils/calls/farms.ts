import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { getNonBscVaultContractFee, MessageTypes } from 'views/Farms/hooks/getNonBscVaultFee'


// let ref
// if(cookies.get('ref')) {
//   if(isAddress( rot13(cookies.get('ref')) )) {
//     ref = rot13(cookies.get('ref'))
//   }
// } else {
//   ref = "0x0000000000000000000000000000000000000000"
// }

export const stakeFarm = async (masterChefContract: Contract, pid, amount, gasPrice, gasLimit?: number) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (pid !== 0) {
    return masterChefContract.deposit(pid, value, {
      gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
      // gasPrice,
    })
  }
  return masterChefContract.enterStaking(value, {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const unstakeFarm = async (masterChefContract, pid, amount, gasPrice, gasLimit?: number) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  if (pid !== 0) {
    return masterChefContract.withdraw(pid, value, {
      gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
      // gasPrice,
    })
  }
  return masterChefContract.leaveStaking(value, {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const harvestFarm = async (masterChefContract, pid, gasPrice, gasLimit?: number) => {
  if (pid !== 0) {
    return masterChefContract.deposit(pid, '0', {
      gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
      // gasPrice,
    })
  }
  return masterChefContract.enterStaking('0', {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const nonBscStakeFarm = async (contract, pid, amount, gasPrice, account, oraclePrice, chainId) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  const totalFee = await getNonBscVaultContractFee({
    pid,
    chainId,
    gasPrice,
    oraclePrice,
    amount: value,
    userAddress: account,
    messageType: MessageTypes.Deposit,
  })
  console.info(totalFee, 'stake totalFee')
  return contract.deposit(pid, value, { value: totalFee })
}

export const nonBscUnstakeFarm = async (contract, pid, amount, gasPrice, account, oraclePrice, chainId) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  const totalFee = await getNonBscVaultContractFee({
    pid,
    chainId,
    gasPrice,
    oraclePrice,
    amount: value,
    userAddress: account,
    messageType: MessageTypes.Withdraw,
  })
  console.info(totalFee, 'unstake totalFee')
  return contract.withdraw(pid, value, { value: totalFee })
}
