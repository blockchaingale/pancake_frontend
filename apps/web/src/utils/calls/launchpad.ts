import { ethers } from "ethers"
// import { Contract } from '@ethersproject/contracts'
// import BigNumber from 'bignumber.js'
// import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'

export const createLaunchpad = async (launchpad, values, addresses, strings, options, gasPrice, gasLimit?: number) => {
  return launchpad.createNewLaunchpad(values, addresses, strings, options, {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const createFairLaunchpad = async (launchpad, values, addresses, strings, options, gasPrice, gasLimit?: number) => {
  return launchpad.createNewFairLaunch(values, addresses, strings, options, {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const contributeForETH = async (launchpad, value) => {
  return launchpad.contribute({
    value: ethers.utils.parseEther(value),
  })
}

export const contributeForToken = async (launchpad, value) => {
  return launchpad.contribute((value))
}

export const disableWhitelist = async (launchpad) => {
  return launchpad.disableWhiteList()
}

export const enableWhitelist = async (launchpad, value) => {
  return launchpad.enableWhiteList(value)
}

export const addWhiteList = async (launchpad, value) => {
  return launchpad.addWhiteList(value)
}

export const removeWhiteList = async (launchpad, value) => {
  return launchpad.removeWhiteList(value)
}

export const cancel = async (launchpad) => {
  return launchpad.cancel()
}

export const finalize = async (launchpad) => {
  return launchpad.finalize()
}

export const updateInfo = async (launchpad, value) => {
  return launchpad.updateInfo(value)
}
