import { ChainId } from "@pancakeswap/sdk"

export interface SerializedLaunchpadData {
  chainId: number
  presaleType: string
  address: string
  logoUrl: string
  token: string
  buyToken: string
  tokenName: string
  tokenSymbol: string
  tokenDecimals: number
  total: number
  rate: number
  hardCap: number
  softCap: number
  maxBuy: number
  amount: number
  liquidity: number
  lockTime: number
  startTime: number
  endTime: number
  refundable: boolean
  claimable: boolean
  whitelist: string
  whiteListEnableTime: number
  owner: string
  status: string
}

export interface SerializedLaunchpadsState {
  data: SerializedLaunchpadData[]
  chainId: number
  loadingKeys?: Record<string, boolean>
}

export const supportedChainId = [ChainId.ARBITRUM, ChainId.BSC, ChainId.POLYGON]