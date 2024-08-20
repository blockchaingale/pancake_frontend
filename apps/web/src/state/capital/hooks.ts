import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SLOW_INTERVAL } from 'config/constants'
import { usePriceByPairs } from 'hooks/useBUSDPrice'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { DCP, USDT } from '@pancakeswap/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { SerializedBond, SerializedBondUserData, SerializedCapitalState, getBondConfig } from '@pancakeswap/capital'
import {
  bondFromNameSelector,
  capitalSelector,
  makeBondFromIdSelector,
  makeUserBondFromIdSelector,
} from './selectors'
import { fetchCapitalPublicDataAsync, fetchCapitalUserDataAsync, fetchInitialCapitalData } from '.'
import { State } from '../types'

export const usePollBondsWithUserData = () => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useActiveWeb3React()

  useSWRImmutable(
    chainId ? ['publicBondData', chainId] : null,
    async () => {
      const bondsConfig = await getBondConfig(chainId)
      const ids = bondsConfig.map((bondToFetch) => bondToFetch.id)
      dispatch(fetchCapitalPublicDataAsync({ ids, chainId }))
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  const name = ['bondsWithUserData', account, chainId]

  useSWRImmutable(
    account && chainId ? name : null,
    async () => {
      const bondsConfig = await getBondConfig(chainId)
      const ids = bondsConfig.map((bondToFetch) => bondToFetch.id)
      const params = { account, ids, chainId }

      dispatch(fetchCapitalUserDataAsync(params))
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useCapital = (): SerializedCapitalState => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => capitalSelector(chainId), [chainId]))
}

export const useBondFromId = (id: number): SerializedBond => {
  const bondFromPid = useMemo(() => makeBondFromIdSelector(id), [id])
  return useSelector(bondFromPid)
}

export const useBondFromName = (name: string): SerializedBond => {
  const bondFromName = useMemo(() => bondFromNameSelector(name), [name])
  return useSelector(bondFromName)
}

export const useBondUser = (id): SerializedBondUserData => {
  const bondFromIdUser = useMemo(() => makeUserBondFromIdSelector(id), [id])
  return useSelector(bondFromIdUser)
}

export const useDCPUSDTPrice = (
  { forceMainnet } = { forceMainnet: false },
): BigNumber => {
  const { chainId } = useActiveChainId()
  const price = usePriceByPairs(USDT[chainId], DCP[chainId])
  return useMemo(() => (price ? new BigNumber(price.toSignificant(6)) : BIG_ZERO), [price])
}
