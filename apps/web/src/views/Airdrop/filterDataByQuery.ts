import latinise from '@pancakeswap/utils/latinise'
import { SerializedSendInfo } from 'state/multisend/types'

export const filterDataByQuery = (bonds: SerializedSendInfo[], query: string): SerializedSendInfo[] => {
  if (query) {
    const queryParts = latinise(query.toLowerCase()).trim().split(' ')
    return bonds.filter((bond: SerializedSendInfo) => {
      const farmSymbol = latinise(bond.tag.toLowerCase())
      return queryParts.every((queryPart) => {
        return farmSymbol.includes(queryPart)
      })
    })
  }
  return bonds
}
