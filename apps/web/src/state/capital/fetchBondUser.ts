import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import bondABI from 'config/abi/dcpBond.json'
import multicall, { multicallv2 } from 'utils/multicall'
import { BondConfigBaseProps } from '@pancakeswap/capital'

export const fetchBondUserAllowances = async (
  account: string,
  bondsToFetch: BondConfigBaseProps[],
  chainId: number,
) => {
  const calls = bondsToFetch.map((bond) => {
    return { address: bond.bondToken.address, name: 'allowance', params: [account, bond.bondAddress] }
  })

  const rawAllowances = await multicall<BigNumber[]>(erc20ABI, calls, chainId)
  const parsedAllowances = rawAllowances.map((balance) => {
    return new BigNumber(balance).toJSON()
  })

  return parsedAllowances
}

export const fetchBondUserTokenBalances = async (
  account: string,
  bondsToFetch: BondConfigBaseProps[],
  chainId: number,
) => {
  const calls = bondsToFetch.map((bond) => {
    return {
      address: bond.bondToken.address,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls, chainId)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchBondUserInfos = async (
  account: string,
  bondsToFetch: BondConfigBaseProps[],
  chainId: number,
) => {
  const calls = bondsToFetch.map((bond) => {
    return {
      address: bond.bondAddress,
      name: 'bondInfo',
      params: [account],
    }
  })

  const rawInfos = await multicallv2({
    abi: bondABI,
    calls,
    chainId
  })
  const parsedBondInfos = rawInfos.map((info) => {
    return {
      payout: new BigNumber(info.payout).toJSON(),
      vesting: new BigNumber(info.vesting).toJSON(),
      lastTime: new BigNumber(info.lastTime).toJSON()
    }
  })
  return parsedBondInfos
}

export const fetchBondUserEarnings = async (account: string, bondsToFetch: BondConfigBaseProps[], chainId: number) => {
  const calls = bondsToFetch.map((bond) => {
    return {
      address: bond.bondAddress,
      name: 'pendingPayoutFor',
      params: [account],
    }
  })

  const rawEarnings = await multicallv2({ abi: bondABI, calls, chainId })
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}