import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

export const multisenderSelector = (chainId: number) =>
  createSelector(
    (state: State) => state.multisender,
    (multisender) => {
      const { data, fee, userDataLoaded } = multisender

      return {
        data,
        fee,
        chainId,
        userDataLoaded,
      }
    },
  )
