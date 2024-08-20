export interface SerializedSendInfo {
  token: string
  receivers: string
  amount: string
  timestamp: string
  tag: string
}

export interface SerializedHistory {
  data: SerializedSendInfo[]
  fee: string
  chainId?: number
  userDataLoaded: boolean
  loadingKeys?: Record<string, boolean>
}