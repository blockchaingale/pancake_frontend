// import { getFarmConfig } from '@pancakeswap/farms/constants'
// import { createFarmFetcher, SerializedFarm, SerializedFarmsState } from '@pancakeswap/farms'
import { getBondConfig, SerializedBond, SerializedBondUserData, SerializedCapitalState, SerializedVault, SerializedVaultUserData, supportedChainId } from '@pancakeswap/capital'
// import { ChainId } from '@pancakeswap/sdk'
import { BIG_TEN } from '@pancakeswap/utils/bigNumber'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
} from '@reduxjs/toolkit/dist/matchers'
import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import pairAbi from 'config/abi/IPancakePair.json'
import stringify from 'fast-json-stable-stringify'
import keyBy from 'lodash/keyBy'
import type { AppState } from 'state'
// import { getDcpTreasuryAddress, getMasterChefAddress } from 'utils/addressHelpers'
// import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
// import { DCP, USDT } from '@pancakeswap/tokens'
import { multicallv2 } from 'utils/multicall'
import { chains } from 'utils/wagmi'
// import { usePriceByPairs } from 'hooks/useBUSDPrice'
import { resetUserState } from '../global/actions'
import fetchBonds from './fetchBonds'
import fetchVault from './fetchVault'
import {
  fetchBondUserAllowances,
  fetchBondUserEarnings,
  fetchBondUserInfos,
  fetchBondUserTokenBalances,
} from './fetchBondUser'
import { fetchVaultUserAllowances, fetchVaultUserTokenBalances } from './fetchVaultUser'
// import { useDCPUSDTPrice } from './hooks'

const fetchCapitalPublicData = async ({ ids, chainId }): Promise<[SerializedBond[], SerializedVault]> => {
  const bondsConfig = await getBondConfig(chainId)
  const bondsCanFetch = bondsConfig.filter(
    (bondConfig) => ids.includes(bondConfig.id),
  )

  const [[reserves]] = await Promise.all([
    multicallv2({
      abi: pairAbi,
      calls: [
        {
          address: "0x168A4C3f7Bc744b05381D8F18588698179849556",
          name: "getReserves"
        }
      ],
      chainId,
    })
  ])

  const marketPrice = new BigNumber(reserves[1]._hex).div(new BigNumber(reserves[0]._hex)).times(BIG_TEN.pow(3))

  const bonds = await fetchBonds(marketPrice, bondsCanFetch, chainId)

  const vault = await fetchVault(marketPrice, chainId)
  
  return [bonds, vault]
}

const initialState: SerializedCapitalState = {
  bonds: [],
  vault: null,
  chainId: null,
  userDataLoaded: false,
  loadingKeys: {},
}

// Async thunks
export const fetchInitialCapitalData = createAsyncThunk<
  { bonds: SerializedBond[]; vault: SerializedVault, chainId: number },
  { chainId: number },
  {
    state: AppState
  }
>('capital/fetchInitialCapitalData', async ({ chainId }) => {
  const bondDataList = await getBondConfig(chainId)
  return {
    bonds: bondDataList.map((bond) => ({
      ...bond,
      userData: {
        allowance: '0',
        balance: '0',
        interestDue: '0',
        bondMaturationBlock: '0',
        pendingPayout: '0',
      },
    })),
    vault: {
      currentIndex: '0',
      totalSupply: '0',
      marketCap: '0',
      circSupply: '0',
      fiveDayRate: '0',
      stakingAPY: '0',
      stakingTVL: '0',
      stakingRebase: '0',
      marketPrice: '0',
      currentBlock: '0',
      currentBlockTime: 0,
      nextRebase: '0',
      rfv: '0',
      runway: '0',
      userData: {
        dcp: {
          balance: '0',
          allowance: '0',
        },
        sdcp: {
          balance: '0',
          allowance: '0',
        },
      },
    },
    chainId,
  }
})

export const fetchCapitalPublicDataAsync = createAsyncThunk<
  [SerializedBond[], SerializedVault],
  { ids: number[]; chainId: number; },
  {
    state: AppState
  }
>(
  'capital/fetchCapitalPublicDataAsync',
  async ({ ids, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.capital.chainId !== chainId) {
      await dispatch(fetchInitialCapitalData({ chainId }))
    }
    const chain = chains.find((c) => c.id === chainId)
    if (!chain || !supportedChainId.includes(chainId)) throw new Error('chain not supported')
    try {
      return fetchCapitalPublicData({ ids, chainId })
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { capital } = getState()
      if (capital.loadingKeys[stringify({ type: fetchCapitalPublicDataAsync.typePrefix, arg })]) {
        console.debug('bonds action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

async function getBondsUserValue(bonds, account, chainId) {
  const [userBondAllowances, userBondTokenBalances, userBondInfos, userBondEarnings] = await Promise.all([
    fetchBondUserAllowances(account, bonds, chainId),
    fetchBondUserTokenBalances(account, bonds, chainId),
    fetchBondUserInfos(account, bonds, chainId),
    fetchBondUserEarnings(account, bonds, chainId),
  ])

  const bondsUserValue = userBondAllowances.map((_, index) => {

    const bondMaturationBlock = new BigNumber(userBondInfos[index].vesting).plus(new BigNumber(userBondInfos[index].lastTime))

    return {
      id: bonds[index].id,
      allowance: userBondAllowances[index],
      balance: userBondTokenBalances[index],
      interestDue: userBondInfos[index].payout,
      bondMaturationBlock: bondMaturationBlock.toJSON(),
      pendingPayout: userBondEarnings[index],
    }
  })

  return bondsUserValue
}

async function getVaultUserValue(account, chainId) {
  const [userVaultAllowances, userVaultTokenBalances] = await Promise.all([
    fetchVaultUserAllowances(account, chainId),
    fetchVaultUserTokenBalances(account, chainId),
  ])

  return {
      dcp: {
        balance: userVaultTokenBalances[0],
        allowance: userVaultAllowances[0],
      },
      sdcp: {
        balance: userVaultTokenBalances[1],
        allowance: userVaultAllowances[1],
      },
  }
}

export interface BondUserResponseData {
  id: number
  allowance: string
  balance: string
  interestDue: string
  bondMaturationBlock: string
  pendingPayout: string
}

export const fetchCapitalUserDataAsync = createAsyncThunk<
  [BondUserResponseData[], SerializedVaultUserData],
  { account: string; ids: number[]; chainId: number },
  {
    state: AppState
  }
>(
  'capital/fetchCapitalUserDataAsync',
  async ({ account, ids, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.capital.chainId !== chainId) {
      await dispatch(fetchInitialCapitalData({ chainId }))
    }

    const bondsConfig = await getBondConfig(chainId)
    const bondsCanFetch = bondsConfig.filter(
      (bondConfig) => ids.includes(bondConfig.id),
    )

    try {
      return [
        await getBondsUserValue(bondsCanFetch, account, chainId),
        await getVaultUserValue(account, chainId)
      ]
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { capital } = getState()
      if (capital.loadingKeys[stringify({ type: fetchCapitalUserDataAsync.typePrefix, arg })]) {
        console.debug('capital user is fetching, skipping here')
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

export const capitalSlice = createSlice({
  name: 'Capital',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.bonds = state.bonds.map((bond) => {
        return {
          ...bond,
          userData: {
            allowance: '0',
            balance: '0',
            interestDue: '0',
            bondMaturationBlock: '0',
            pendingPayout: '0',
          },
        }
      })
      state.userDataLoaded = false
    })
    // Init capital data
    builder.addCase(fetchInitialCapitalData.fulfilled, (state, action) => {
      const { bonds, vault, chainId } = action.payload
      state.bonds = bonds
      state.vault = vault
      state.chainId = chainId
    })

    // Update capital with live data
    builder.addCase(fetchCapitalPublicDataAsync.fulfilled, (state, action) => {
      const [bondPayload, vaultPayload] = action.payload
      const bondPayloadIdMap = keyBy(bondPayload, 'id')

      state.bonds = state.bonds.map((bond) => {
        const liveBondData = bondPayloadIdMap[bond.id]
        return { ...bond, ...liveBondData }
      })
      state.vault = { ...state.vault, ...vaultPayload }
    })

    // Update capital with user data
    builder.addCase(fetchCapitalUserDataAsync.fulfilled, (state, action) => {
      const [bondPayload, vaultPayload] = action.payload
      const userDataMap = keyBy(bondPayload, 'id')
      state.bonds = state.bonds.map((bond) => {
        const userDataEl = userDataMap[bond.id]
        if (userDataEl) {
          return { ...bond, userData: userDataEl }
        }
        return bond
      })
      state.vault = {...state.vault, userData: vaultPayload}
      state.userDataLoaded = true
    })

    builder.addMatcher(isAnyOf(fetchCapitalPublicDataAsync.pending, fetchCapitalUserDataAsync.pending), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
    })
    builder.addMatcher(
      isAnyOf(fetchCapitalPublicDataAsync.fulfilled, fetchCapitalUserDataAsync.fulfilled),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'fulfilled')] = false
      },
    )
    builder.addMatcher(
      isAnyOf(fetchCapitalPublicDataAsync.rejected, fetchCapitalUserDataAsync.rejected),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
      },
    )
  },
})

export default capitalSlice.reducer
