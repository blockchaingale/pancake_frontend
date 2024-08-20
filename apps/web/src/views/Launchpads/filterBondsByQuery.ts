import latinise from '@pancakeswap/utils/latinise'
import { SerializedLaunchpadData } from 'state/launchpads/types'

export const filterPoolsByQuery = (pools: SerializedLaunchpadData[], query: string): SerializedLaunchpadData[] => {
  if (query) {
    const queryParts = latinise(query.toLowerCase()).trim().split(' ')
    return pools.filter((pool: SerializedLaunchpadData) => {
      const poolSymbol = latinise(pool.tokenSymbol.toLowerCase())
      const poolName = latinise(pool.tokenName.toLowerCase())
      return queryParts.every((queryPart) => {
        return poolSymbol.includes(queryPart) || poolName.includes(queryPart)
      })
    })
  }
  return pools
}
