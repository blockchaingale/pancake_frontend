import { ERC20Token, ChainId } from '@pancakeswap/sdk'
// import { bscTokens, ethereumTokens } from '@pancakeswap/tokens'
import { CAKE_BNB_LP_MAINNET } from './lp'
import { Ifo } from './types'

export const cakeBnbLpToken = new ERC20Token(ChainId.BSC, CAKE_BNB_LP_MAINNET, 18, 'CAKE-BNB LP')

const ifos: Ifo[] = [
  // {
  //   id: 'cyberglow',
  //   address: '0x1c08069C8Cf59c4f39289689BC65156E243a0dF5',
  //   isActive: true,
  //   name: 'DKO',
  //   plannedStartTime: 1698678000, // Oct 27 2023 15:00:00 UTC
  //   poolBasic: {
  //     raiseAmount: '20,000,000 SMR',
  //   },
  //   poolUnlimited: {
  //     raiseAmount: '20,000,000 SMR',
  //   },
  //   currency: shimmerTokens.smr,
  //   token: shimmerTokens.cgt,
  //   campaignId: '0',
  //   articleUrl:
  //     '/',
  //   tokenOfferingPrice: 0.8,
  //   version: 2,
  //   twitterUrl: 'https://twitter.com/Cyberglow_cgt',
  //   description:
  //     'Duckstail is a decentralized exchange that provides cryptocurrency users with a secure, efficient and fully decentralized platform for exchanging digital assets. With a focus on transparency, security, and accessibility, our DEX is designed to give users absolute control over their assets and operations.',
  //   vestingTitle: 'Use $DKO to enjoy premium features(exchange, farming, staking, game, etc) on Duckstail Decentralized Exchange',
  // }
]

export default ifos
