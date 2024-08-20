import { Currency } from "@pancakeswap/sdk"

export enum LaunchpadFormView {
  VerifyToken,
  DeFiInfo,
  Socials,
  Review,
  Finish,
}

export interface TokenData {
  tokenAddress: string
  tokenName: string
  tokenDecimals: number
  tokenSymbol: string
  currency: Currency
  mainFee: string
  tokenFee: string
  // listingOption: boolean
}

export interface Socials {
  website: string
  logoUrl: string
  facebook: string
  twitter: string
  github: string
  telegram: string
  instagram: string
  discord: string
  reddit: string
  youtube: string
  whitelist: string
  description: string
}

export interface Vesting {
  vestingFirst: string
  vestingPeriod: string
  vestingEach: string
}

export interface DeFi {
  total: string
  whitelist: boolean
  softCap: string
  isMax: boolean
  maximumBuy: string
  liquidity: string
  startTime: string
  endTime: string
  lockTime: string
  totalAmount: string
  isVesting: boolean
  vestingData?: Vesting
}

export interface FinishData {
  address: string
}