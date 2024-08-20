import { getNetwork, watchNetwork } from '@pancakeswap/awgmi/core'
import { useSyncExternalStoreWithTracked } from './useSyncExternalStoreWithTracked'

export function useNetwork() {
  // console.log('watchNetwork', watchNetwork(), 'getNetwork', getNetwork())
  return useSyncExternalStoreWithTracked(watchNetwork, getNetwork)
}
