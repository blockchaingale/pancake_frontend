import { createSelector } from '@reduxjs/toolkit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { State } from '../types'

const selectBondByKey = (key: string, value: string | number) => (state: State) =>
  state.capital.bonds.find((b) => b[key] === value)

export const makeBondFromIdSelector = (id: number) =>
  createSelector([selectBondByKey('id', id)], (bond) => bond)

export const bondFromNameSelector = (name: string) =>
  createSelector([selectBondByKey('name', name)], (bond) => bond)

export const makeUserBondFromIdSelector = (id: number) =>
  createSelector([selectBondByKey('id', id)], (bond) => bond.userData)

export const capitalSelector = (chainId: number) =>
  createSelector(
    (state: State) => state.capital,
    (capital) => {
      const bonds = capital.bonds.filter((bond) => bond.bondToken.chainId === chainId)
      const { vault, userDataLoaded } = capital

      return {
        bonds,
        vault,
        chainId,
        userDataLoaded,
      }
    },
  )
