import { ethers } from "ethers"

export const multiSendToken = async (multisenderContract, token, addresses, amounts, tag, gasPrice, gasLimit?: number) => {
  return multisenderContract.multisendToken(token, false, addresses, amounts, tag, {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const multiSendEther = async (multisenderContract, totalAmount, addresses, amounts, tag, gasPrice, gasLimit?: number) => {
  return multisenderContract.multisendEther(addresses, amounts, tag, {
    value: ethers.utils.parseEther(totalAmount),
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

// export const burnETH = async (bridgeContract: Contract, pid, amount, gasPrice, gasLimit?: number) => {
//   return bridgeContract.burnETH(pid, {
//     value: ethers.utils.parseEther(new BigNumber(amount).toString()),
//     gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
//     gasPrice,
//   })
// }
