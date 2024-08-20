import erc20 from 'config/abi/erc20.json'
import bondAbi from 'config/abi/dcpBond.json'
import bondCalcAbi from 'config/abi/dcpBondCalculator.json'
import chunk from 'lodash/chunk'
import { getDcpTreasuryAddress, getDcpBondCalculatorAddress } from 'utils/addressHelpers'
import { multicallv2, multicallv3 } from 'utils/multicall'
import { BondConfigBaseProps, SerializedBondPublicData } from '@pancakeswap/capital'

const fetchPublicBondCalls = (bond: BondConfigBaseProps, chainId: number) => {
  const { bondToken, bondAddress } = bond
  return [
    // Balance of token in the DCP treasury
    {
      abi: erc20,
      address: bondToken.address,
      name: 'balanceOf',
      params: [getDcpTreasuryAddress(chainId)],
    },
    {
      abi: bondAbi,
      address: bondAddress,
      name: 'terms',
    },
    {
      abi: bondAbi,
      address: bondAddress,
      name: 'maxPayout',
    },
    {
      abi: bondAbi,
      address: bondAddress,
      name: 'bondPrice',
    },
    {
      abi: bondAbi,
      address: bondAddress,
      name: 'bondPriceInUSD',
    },
  ]
}

export const fetchPublicBondData = async (bonds: BondConfigBaseProps[], chainId: number): Promise<any[]> => {
  const bondCalls = bonds.flatMap((bond) => fetchPublicBondCalls(bond, chainId))
  const chunkSize = bondCalls.length / bonds.length
  const bondMultiCallResult = await multicallv3({ calls: bondCalls, chainId, allowFailure: true})
  return chunk(bondMultiCallResult, chunkSize)
}

const fetchBondCalcCalls = (bond: SerializedBondPublicData, chainId: number) => {
  const { bondToken, purchased, lpBond } = bond
  return [
    {
      abi: bondAbi,
      address: getDcpBondCalculatorAddress(chainId),
      name: 'getTotalValue',
      params: [bondToken.address],
    },
    {
      abi: erc20,
      address: bondToken.address,
      name: 'totalSupply',
    },
    {
      abi: bondAbi,
      address: getDcpBondCalculatorAddress(chainId),
      name: 'markdown',
      params: [bondToken.address],
    },
    {
      abi: bondAbi,
      address: getDcpBondCalculatorAddress(chainId),
      name: 'valuation',
      params: [bondToken.address, purchased],
    }
  ]
}

export const fetcBondCalcData = async (bonds: SerializedBondPublicData[], chainId: number): Promise<any[]> => {
  const bondCalcCalls = bonds.flatMap((bond) => fetchBondCalcCalls(bond, chainId))
  const chunkSize = bondCalcCalls.length / bonds.length
  const bondCalcMultiCallResult = await multicallv3({ calls: bondCalcCalls, chainId, allowFailure: true })
  return chunk(bondCalcMultiCallResult, chunkSize)
}
