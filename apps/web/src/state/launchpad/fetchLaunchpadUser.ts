import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import launchpadAbi from 'config/abi/launchpadForETH.json'
import multiCallAbi from 'config/abi/Multicall.json'
import { ZERO_ADDRESS } from 'config/constants'
import { multicallv2, multicallv3 } from 'utils/multicall'
import { getMulticallAddress } from 'utils/addressHelpers'
import { SerializedLaunchpadUserData } from './types'

const fetchEthUser = async (
  account: string,
  chainId: number,
): Promise<any> => {
  const multicallAddress = getMulticallAddress()

  const ethBalanceCall = {
    abi: multiCallAbi,
    address: multicallAddress,
    name: 'getEthBalance',
    params: [account],
  }

  const ethBalancesRaw = await multicallv3({ calls: [ethBalanceCall], chainId, allowFailure: true })

  const ethBalance = new BigNumber(ethBalancesRaw[0][0]._hex).toNumber()

  return {
    allowance: 0,
    balance: ethBalance
  }
}

const fetchTokenUser = async (
  launchpad: string,
  account: string,
  token: string,
  chainId: number,
): Promise<any> => {
  const calls = [
    {
      abi: erc20ABI,
      address: token,
      name: 'allowance',
      params: [account, launchpad],
    },
    {
      abi: erc20ABI,
      address: token,
      name: 'balanceOf',
      params: [account],
    },
  ]

  const userDataMultiCallResult = await multicallv3({ calls, chainId, allowFailure: true })
  const tokenAllowance = new BigNumber(userDataMultiCallResult[0][0]._hex).toNumber()
  const tokenBalance = new BigNumber(userDataMultiCallResult[1][0]._hex).toNumber()
  return {
    allowance: tokenAllowance,
    balance: tokenBalance
  }
}

const fetchLaunchpadUser = async (
  launchpad: string,
  account: string,
  chainId: number,
): Promise<any[]> => {
  const calls = [
    {
      abi: launchpadAbi,
      address: launchpad,
      name: 'deposits',
      params: [account],
    },
    {
      abi: launchpadAbi,
      address: launchpad,
      name: 'claimed',
      params: [account],
    },
    {
      abi: launchpadAbi,
      address: launchpad,
      name: 'whiteList',
      params: [account],
    },
    {
      abi: launchpadAbi,
      address: launchpad,
      name: 'owner',
    },
  ]

  const userDataMultiCallResult = await multicallv3({ calls, chainId, allowFailure: true })
  return userDataMultiCallResult
}

function launchpadTransformer (launchpadUserDataResult : any[], account: string) {
  const [
    deposit,
    claimed,
    whitelisted,
    owner,
  ] = launchpadUserDataResult

  return {
    deposit: new BigNumber(deposit[0]._hex).toNumber(),
    claimed: new BigNumber(claimed[0]._hex).toNumber(),
    owner: owner[0] === account,
    whitelisted: whitelisted[0]
  }
}

const fetchLaunchpadUserData = async (launchpad: string, account: string, chainId: number): Promise<SerializedLaunchpadUserData> => {
  const [[[token]]] = await Promise.all([
    multicallv2({
      abi: launchpadAbi,
      calls: [
        {
          address: launchpad,
          name: "buyToken"
        }
      ],
      chainId,
    })
  ])

  const [launchpadUserDataResult] = await Promise.all([
    fetchLaunchpadUser(launchpad, account, chainId)
  ])

  const [tokenUserDataResult] = token !== ZERO_ADDRESS ? await Promise.all([
    fetchTokenUser(launchpad, account, token, chainId)
  ]) : await Promise.all([
    fetchEthUser(account, chainId)
  ])

  const launchpadUserData = launchpadTransformer(launchpadUserDataResult, account)

  return {...tokenUserDataResult, ...launchpadUserData}
}

export default fetchLaunchpadUserData