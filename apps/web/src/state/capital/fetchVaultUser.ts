import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import { DCP, SDCP } from '@pancakeswap/tokens'
import multicall, { multicallv2 } from 'utils/multicall'
import { getDcpStakingAddress, getDcpStakingHelperAddress } from 'utils/addressHelpers'

export const fetchVaultUserAllowances = async (
  account: string,
  chainId: number,
) => {
  const calls = [
    {
    address: DCP[chainId].address,
    name: 'allowance',
    params: [account, getDcpStakingHelperAddress(chainId)],
    },
    {
      address: SDCP[chainId].address,
      name: 'allowance',
      params: [account, getDcpStakingAddress(chainId)],
    },
  ]

  const rawAllowances = await multicall<BigNumber[]>(erc20ABI, calls, chainId)
  const parsedAllowances = rawAllowances.map((balance) => {
    return new BigNumber(balance).toJSON()
  })

  return parsedAllowances
}

export const fetchVaultUserTokenBalances = async (
  account: string,
  chainId: number,
) => {
  const calls = [
    {
    address: DCP[chainId].address,
    name: 'balanceOf',
    params: [account],
    },
    {
      address: SDCP[chainId].address,
      name: 'balanceOf',
      params: [account],
    },
  ]

  const rawTokenBalances = await multicall(erc20ABI, calls, chainId)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}