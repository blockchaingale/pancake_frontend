import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
} from '@reduxjs/toolkit/dist/matchers'
import stringify from 'fast-json-stable-stringify'
import type { AppState } from 'state'
import { chains } from 'utils/wagmi'
import { SerializedLaunchpadData, SerializedLaunchpadsState, supportedChainId } from './types'
import fetchLaunchpads from './fetchLaunchpads'

const initialState: SerializedLaunchpadsState = {
  data: [],
  chainId: 42161,
  loadingKeys: {},
}

// Async thunks
export const fetchInitialLaunchpadsData = createAsyncThunk<
  { launchpads: SerializedLaunchpadData[], chainId: number },
  { chainId: number },
  {
    state: AppState
  }
>('launchpads/fetchInitialLaunchpadsData', async ({ chainId }) => {
  return {
    launchpads: [],
    chainId,
  }
})

export const fetchLaunchpadsPublicDataAsync = createAsyncThunk<
  SerializedLaunchpadData[],
  { chainId: number; size: number; cursor: number; },
  {
    state: AppState
  }
>(
  'launchpads/fetchLaunchpadsPublicDataAsync',
  async ({ chainId, size, cursor }, { dispatch, getState }) => {
    const state = getState()
    if (state.launchpads.chainId !== chainId) {
      await dispatch(fetchInitialLaunchpadsData({ chainId }))
    }
    const chain = chains.find((c) => c.id === chainId)
    if (!chain || !supportedChainId.includes(chainId)) throw new Error('chain not supported')
    try {
      return await fetchLaunchpads(chainId, size, cursor)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { launchpads } = getState()
      if (launchpads.loadingKeys[stringify({ type: fetchLaunchpadsPublicDataAsync.typePrefix, arg })]) {
        console.debug('launchpads action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

type UnknownAsyncThunkFulfilledOrPendingAction =
  | UnknownAsyncThunkFulfilledAction
  | UnknownAsyncThunkPendingAction
  | UnknownAsyncThunkRejectedAction

const serializeLoadingKey = (
  action: UnknownAsyncThunkFulfilledOrPendingAction,
  suffix: UnknownAsyncThunkFulfilledOrPendingAction['meta']['requestStatus'],
) => {
  const type = action.type.split(`/${suffix}`)[0]
  return stringify({
    arg: action.meta.arg,
    type,
  })
}

export const launchpadsSlice = createSlice({
  name: 'Launchpads',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Init launchpad data
    builder.addCase(fetchInitialLaunchpadsData.fulfilled, (state, action) => {
      const { launchpads, chainId } = action.payload
      state.data = launchpads
      state.chainId = chainId
    })

    // Update launchpad with live data
    builder.addCase(fetchLaunchpadsPublicDataAsync.fulfilled, (state, action) => {
      const data= action.payload
      state.data = data
    })

    builder.addMatcher(isAnyOf(fetchLaunchpadsPublicDataAsync.pending, fetchLaunchpadsPublicDataAsync.pending), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
    })
    builder.addMatcher(
      isAnyOf(fetchLaunchpadsPublicDataAsync.rejected, fetchLaunchpadsPublicDataAsync.rejected),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
      },
    )
  },
})

export default launchpadsSlice.reducer
