import BigNumber from 'bignumber.js'
import launchpadAbi from 'config/abi/launchpadForETH.json'
import fairLaunchAbi from 'config/abi/fairLaunchForETH.json'
import { multicallv2, multicallv3 } from 'utils/multicall'
import { SerializedLaunchpad } from './types'

const LAUNCHPAD_VARIABLES = ['presaleType', 'token', 'buyToken', 'presaleStartTimestamp', 'presaleEndTimestamp', 'softCap', 'hardCap', 'minBuy', 'maxBuy', 'rate', 'listingRate', 'lockPeriod', 'isAutoListing', 'vestingFirst', 'vestingPeriod', 'vestingEach', 'mainFee', 'tokenFee', 'liquidity', 'router', 'locker', 'feeAddress', 'tokenBackAddress', 'whiteListEnableTime', 'totalDepositedBalance', 'totalClaimedAmount', 'investors', 'refundable', 'claimable', 'initialized', 'info', 'logoUrl', 'website', 'twitter', 'facebook', 'github', 'telegram', 'instagram', 'discord', 'reddit', 'youtube', 'whitelist', 'getWhiteListLength']
const FAIRLAUNCH_VARIABLES = ['presaleType', 'token', 'buyToken', 'presaleStartTimestamp', 'presaleEndTimestamp', 'softCap', 'maxBuy', 'total', 'listingRate', 'lockPeriod', 'vestingFirst', 'vestingPeriod', 'vestingEach', 'mainFee', 'tokenFee', 'liquidity', 'router', 'locker', 'feeAddress', 'totalDepositedBalance', 'totalClaimedAmount', 'investors', 'refundable', 'claimable', 'initialized', 'info', 'logoUrl', 'website', 'twitter', 'facebook', 'github', 'telegram', 'instagram', 'discord', 'reddit', 'youtube', 'whitelist', 'getWhiteListLength']

const calls = (launchpad: string, presaleType: string) => {
  if (presaleType === "standard")
    return LAUNCHPAD_VARIABLES.map((val) => { return {
      abi: launchpadAbi,
      address: launchpad,
      name: val,
    }})
  return FAIRLAUNCH_VARIABLES.map((val) => { return {
    abi: fairLaunchAbi,
    address: launchpad,
    name: val,
  }})
}

export const fetchLaunchpadData = async (launchpad: string, presaleType: string, chainId: number): Promise<any[]> => {
  const launchpadMultiCallResult = await multicallv3({ calls: calls(launchpad, presaleType), chainId, allowFailure: true })
  return launchpadMultiCallResult
}

function launchpadTransformer (chainId: number, launchpadResult : any[]) {
  const [
    presaleType,
    token,
    buyToken,
    presaleStartTimestamp,
    presaleEndTimestamp,
    softCap,
    hardCap,
    minBuy,
    maxBuy,
    rate,
    listingRate,
    lockPeriod,
    isAutoListing,
    vestingFirst,
    vestingPeriod,
    vestingEach,
    mainFee,
    tokenFee,
    liquidity,
    router,
    locker,
    feeAddress,
    tokenBackAddress,
    whiteListEnableTime,
    totalDepositedBalance,
    totalClaimedAmount,
    investors,
    refundable,
    claimable,
    initialized,
    info,
    logoUrl,
    website,
    twitter,
    facebook,
    github,
    telegram,
    instagram,
    discord,
    reddit,
    youtube,
    whitelist,
    whitelistLength
  ] = launchpadResult

  return {
    chainId,
    presaleType: presaleType[0],
    token: token[0],
    buyToken: buyToken[0],
    presaleStartTimestamp: new BigNumber(presaleStartTimestamp[0]._hex).toNumber(),
    presaleEndTimestamp: new BigNumber(presaleEndTimestamp[0]._hex).toNumber(),
    softCap: new BigNumber(softCap[0]._hex).toNumber(),
    hardCap: new BigNumber(hardCap[0]._hex).toNumber(),
    minBuy: new BigNumber(minBuy[0]._hex).toNumber(),
    maxBuy: new BigNumber(maxBuy[0]._hex).toNumber(),
    rate: new BigNumber(rate[0]._hex).toNumber(),
    listingRate: new BigNumber(listingRate[0]._hex).toNumber(),
    lockPeriod: new BigNumber(lockPeriod[0]._hex).toNumber(),
    isAutoListing: isAutoListing[0],
    vestingFirst: new BigNumber(vestingFirst[0]._hex).toNumber(),
    vestingPeriod: new BigNumber(vestingPeriod[0]._hex).toNumber(),
    vestingEach: new BigNumber(vestingEach[0]._hex).toNumber(),
    mainFee: new BigNumber(mainFee[0]._hex).toNumber(),
    tokenFee: new BigNumber(tokenFee[0]._hex).toNumber(),
    liquidity: new BigNumber(liquidity[0]._hex).toNumber(),
    router: router[0],
    locker: locker[0],
    feeAddress: feeAddress[0],
    tokenBackAddress: tokenBackAddress[0],
    whiteListEnableTime: new BigNumber(whiteListEnableTime[0]._hex).toNumber(),
    totalDepositedBalance: new BigNumber(totalDepositedBalance[0]._hex).toNumber(),
    totalClaimedAmount: new BigNumber(totalClaimedAmount[0]._hex).toNumber(),
    investors: new BigNumber(investors[0]._hex).toNumber(),
    refundable: refundable[0],
    claimable: claimable[0],
    initialized: initialized[0],
    info: info[0],
    logoUrl: logoUrl[0],
    website: website[0],
    twitter: twitter[0],
    facebook: facebook[0],
    github: github[0],
    telegram: telegram[0],
    instagram: instagram[0],
    discord: discord[0],
    reddit: reddit[0],
    youtube: youtube[0],
    whitelist: whitelist[0],
    whitelistLength: new BigNumber(whitelistLength[0]._hex).toNumber(),
  }
}

function fairlaunchTransformer (chainId: number, launchpadResult : any[]) {
  const [
    presaleType,
    token,
    buyToken,
    presaleStartTimestamp,
    presaleEndTimestamp,
    softCap,
    maxBuy,
    total,
    listingRate,
    lockPeriod,
    vestingFirst,
    vestingPeriod,
    vestingEach,
    mainFee,
    tokenFee,
    liquidity,
    router,
    locker,
    feeAddress,
    totalDepositedBalance,
    totalClaimedAmount,
    investors,
    refundable,
    claimable,
    initialized,
    info,
    logoUrl,
    website,
    twitter,
    facebook,
    github,
    telegram,
    instagram,
    discord,
    reddit,
    youtube,
    whitelist,
    whitelistLength
  ] = launchpadResult

  return {
    chainId,
    presaleType: presaleType[0],
    token: token[0],
    buyToken: buyToken[0],
    presaleStartTimestamp: new BigNumber(presaleStartTimestamp[0]._hex).toNumber(),
    presaleEndTimestamp: new BigNumber(presaleEndTimestamp[0]._hex).toNumber(),
    softCap: new BigNumber(softCap[0]._hex).toNumber(),
    maxBuy: new BigNumber(maxBuy[0]._hex).toNumber(),
    total: new BigNumber(total[0]._hex).toNumber(),
    listingRate: new BigNumber(listingRate[0]._hex).toNumber(),
    lockPeriod: new BigNumber(lockPeriod[0]._hex).toNumber(),
    vestingFirst: new BigNumber(vestingFirst[0]._hex).toNumber(),
    vestingPeriod: new BigNumber(vestingPeriod[0]._hex).toNumber(),
    vestingEach: new BigNumber(vestingEach[0]._hex).toNumber(),
    mainFee: new BigNumber(mainFee[0]._hex).toNumber(),
    tokenFee: new BigNumber(tokenFee[0]._hex).toNumber(),
    liquidity: new BigNumber(liquidity[0]._hex).toNumber(),
    router: router[0],
    locker: locker[0],
    feeAddress: feeAddress[0],
    totalDepositedBalance: new BigNumber(totalDepositedBalance[0]._hex).toNumber(),
    totalClaimedAmount: new BigNumber(totalClaimedAmount[0]._hex).toNumber(),
    investors: new BigNumber(investors[0]._hex).toNumber(),
    refundable: refundable[0],
    claimable: claimable[0],
    initialized: initialized[0],
    info: info[0],
    logoUrl: logoUrl[0],
    website: website[0],
    twitter: twitter[0],
    facebook: facebook[0],
    github: github[0],
    telegram: telegram[0],
    instagram: instagram[0],
    discord: discord[0],
    reddit: reddit[0],
    youtube: youtube[0],
    whitelist: whitelist[0],
    whitelistLength: new BigNumber(whitelistLength[0]._hex).toNumber(),
  }
}

const fetchLaunchpad = async (launchpad: string, chainId: number): Promise<SerializedLaunchpad> => {
  const [[[presaleType]]] = await Promise.all([
    multicallv2({
      abi: launchpadAbi,
      calls: [
        {
          address: launchpad,
          name: "presaleType"
        }
      ],
      chainId,
    })
  ])

  const [launchpadResult] = await Promise.all([
    fetchLaunchpadData(launchpad, presaleType, chainId)
  ])

  if (presaleType === "standard")
    return launchpadTransformer(chainId, launchpadResult)
  return fairlaunchTransformer(chainId, launchpadResult)
}

export default fetchLaunchpad
