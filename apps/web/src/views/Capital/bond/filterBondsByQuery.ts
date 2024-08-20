import latinise from '@pancakeswap/utils/latinise'
import { SerializedBond } from '@pancakeswap/capital/src/types'

export const filterBondsByQuery = (bonds: SerializedBond[], query: string): SerializedBond[] => {
  if (query) {
    const queryParts = latinise(query.toLowerCase()).trim().split(' ')
    return bonds.filter((bond: SerializedBond) => {
      const farmSymbol = latinise(bond.bondToken.symbol.toLowerCase())
      return queryParts.every((queryPart) => {
        return farmSymbol.includes(queryPart)
      })
    })
  }
  return bonds
}
