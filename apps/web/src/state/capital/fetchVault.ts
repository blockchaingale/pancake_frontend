import BigNumber from 'bignumber.js'
import { getUnixTime } from 'date-fns'
import { BIG_TEN, BIG_TWO, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { DCP, SDCP } from '@pancakeswap/tokens'
import erc20 from 'config/abi/erc20.json'
import sdcp from 'config/abi/sdcp.json'
import multiCallAbi from 'config/abi/Multicall.json'
import stakingAbi from 'config/abi/dcpStaking.json'
import { multicallv3 } from 'utils/multicall'
import { getDcpStakingAddress, getMulticallAddress } from 'utils/addressHelpers'
import { SerializedVault } from '@pancakeswap/capital'

const multicallAddress = getMulticallAddress()

const fetchVaultCalls = (chainId: number) => {
  return [
    {
      abi: erc20,
      address: DCP[chainId].address,
      name: 'totalSupply',
    },
    {
      abi: sdcp,
      address: SDCP[chainId].address,
      name: 'circulatingSupply',
    },
    {
      abi: multiCallAbi,
      address: multicallAddress,
      name: 'getBlockNumber',
    },
    {
      abi: stakingAbi,
      address: getDcpStakingAddress(chainId),
      name: 'epoch',
    },
    {
      abi: stakingAbi,
      address: getDcpStakingAddress(chainId),
      name: 'index',
    }
  ]
}

export const fetchVaultData = async (chainId: number): Promise<any[]> => {
  const bondMultiCallResult = await multicallv3({ calls: fetchVaultCalls(chainId), chainId, allowFailure: true })
  return bondMultiCallResult
}

function vaultTransformer (marketPrice: BigNumber, vaultResult : any[]) {
  const [
    totalSupply,
    circSupply,
    blockNumber,
    epoch,
    index
  ] = vaultResult

  const marketCap = new BigNumber(totalSupply[0]._hex).times(marketPrice).div(BIG_TEN.pow(9))
  const stakingTVL = new BigNumber(circSupply[0]._hex).times(marketPrice).div(BIG_TEN.pow(9))
  const stakingReward = epoch.distribute;
  const stakingRebase = new BigNumber(stakingReward._hex).div(new BigNumber(circSupply[0]._hex));
  const fiveDayRate = stakingRebase.plus(1).pow(5 * 3).minus(1)
  const stakingAPY = stakingRebase.plus(1).pow(365 * 3).minus(1)


  return {
    currentIndex: new BigNumber(index[0]._hex).toJSON(),
    totalSupply: new BigNumber(totalSupply[0]._hex).toJSON(),
    marketCap: marketCap.toJSON(),
    circSupply: new BigNumber(circSupply[0]._hex).toJSON(),
    fiveDayRate: fiveDayRate.toJSON(),
    stakingAPY: stakingAPY.toJSON(),
    stakingTVL: stakingTVL.toJSON(),
    stakingRebase: stakingRebase.toJSON(),
    marketPrice: marketPrice.toJSON(),
    currentBlock: new BigNumber(blockNumber[0]._hex).toJSON(),
    currentBlockTime: getUnixTime(new Date()),
    nextRebase: epoch.endTime,
  }
}

const fetchVault = async (marketPrice: BigNumber, chainId: number): Promise<SerializedVault> => {
  const [vaultResult] = await Promise.all([
    fetchVaultData(chainId)
  ])

  return vaultTransformer(marketPrice, vaultResult)
}

export default fetchVault
