import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

export const launchpadsSelector = (chainId: number) =>
  createSelector(
    (state: State) => state.launchpads,
    (launchpads) => {
      const { data } = launchpads

      return {
        data,
        chainId
      }
    },
  )
