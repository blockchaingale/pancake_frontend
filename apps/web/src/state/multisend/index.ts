import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
} from '@reduxjs/toolkit/dist/matchers'
import BigNumber from 'bignumber.js'
import multisenderAbi from 'config/abi/multisender.json'
import stringify from 'fast-json-stable-stringify'
import { ChainId } from '@pancakeswap/sdk'
import type { AppState } from 'state'
import { chains } from 'utils/wagmi'
import multicall, { multicallv2 } from 'utils/multicall'
import addresses from 'config/constants/contracts'
import { resetUserState } from '../global/actions'
import { SerializedHistory, SerializedSendInfo } from './types'
// import { useDCPUSDTPrice } from './hooks'

const initialState: SerializedHistory = {
  data: [],
  fee: "0",
  chainId: null,
  userDataLoaded: false,
  loadingKeys: {},
}

// Async thunks
export const fetchInitialMultisenderData = createAsyncThunk<
  { data: SerializedSendInfo[], fee: string, chainId: number },
  { chainId: number },
  {
    state: AppState
  }
>('multisender/fetchInitialMultisenderData', async ({ chainId }) => {
  return {
    data: [],
    fee: "0",
    chainId,
  }
})

async function getSendInfo(account, chainId) {
  const [[sendInfo]] = await Promise.all([
    multicallv2({
      abi: multisenderAbi,
      calls: [
        {
          address: addresses.multisender[chainId],
          name: "getSendInfo",
          params: [account]
        }
      ],
      chainId,
    })
  ])

  if (sendInfo[0].length === 0) return []

  const SendInfo = sendInfo[0].map((info) => { return {
    token: info[0],
    receivers: new BigNumber(info[1]._hex).toJSON(),
    amount: new BigNumber(info[2]._hex).toJSON(),
    timestamp: new BigNumber(info[3]._hex).toJSON(),
    tag: info[4],
  }})

  return SendInfo
}

async function getFee(chainId) {
  const [[fee]] = await Promise.all([
    multicallv2({
      abi: multisenderAbi,
      calls: [
        {
          address: addresses.multisender[chainId],
          name: "feeRate"
        }
      ],
      chainId,
    })
  ])

  return new BigNumber(fee[0]._hex).toJSON()
}

export const fetchMultisenderPublicDataAsync = createAsyncThunk<
  string,
  { chainId: number; },
  {
    state: AppState
  }
>(
  'multisender/fetchMultisenderPublicDataAsync',
  async ({ chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.multisender.chainId !== chainId) {
      await dispatch(fetchInitialMultisenderData({ chainId }))
    }

    const chain = chains.find((c) => c.id === chainId)
    if (!chain) throw new Error('chain not supported')
    
    try {
      return await getFee(chainId)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { multisender } = getState()
      if (multisender.loadingKeys[stringify({ type: fetchMultisenderPublicDataAsync.typePrefix, arg })]) {
        console.debug('multisender action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

export const fetchMultisenderUserDataAsync = createAsyncThunk<
  SerializedSendInfo[],
  { account: string; chainId: number },
  {
    state: AppState
  }
>(
  'multisender/fetchMultisenderUserDataAsync',
  async ({ account, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.multisender.chainId !== chainId) {
      await dispatch(fetchInitialMultisenderData({ chainId }))
    }

    try {
      return await getSendInfo(account, chainId)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { multisender } = getState()
      if (multisender.loadingKeys[stringify({ type: fetchMultisenderUserDataAsync.typePrefix, arg })]) {
        console.debug('multisender user is fetching, skipping here')
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

export const multisenderSlice = createSlice({
  name: 'Multisender',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.data = []
    })
    // Init multisender data
    builder.addCase(fetchInitialMultisenderData.fulfilled, (state, action) => {
      const { data, fee, chainId } = action.payload
      state.data = data
      state.fee = fee
      state.chainId = chainId
    })

    builder.addCase(fetchMultisenderPublicDataAsync.fulfilled, (state, action) => {
      const fee = action.payload
      state.fee = fee
    })

    // Update multisender with user data
    builder.addCase(fetchMultisenderUserDataAsync.fulfilled, (state, action) => {
      const dataPayload = action.payload
      // const userDataMap = keyBy(bondPayload, 'id')
      // state.data = state.data.map((row) => {
      //   const userDataEl = userDataMap[bond.id]
      //   if (userDataEl) {
      //     return { ...bond, userData: userDataEl }
      //   }
      //   return bond
      // })
      state.data = dataPayload
      state.userDataLoaded = true
    })
    builder.addMatcher(isAnyOf(fetchMultisenderPublicDataAsync.pending, fetchMultisenderPublicDataAsync.pending), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
    })
    builder.addMatcher(
      isAnyOf(fetchMultisenderUserDataAsync.fulfilled, fetchMultisenderUserDataAsync.fulfilled),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'fulfilled')] = false
      },
    )
    builder.addMatcher(
      isAnyOf(fetchMultisenderPublicDataAsync.rejected, fetchMultisenderPublicDataAsync.rejected),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
      },
    )
  },
})

export default multisenderSlice.reducer
