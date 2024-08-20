import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SLOW_INTERVAL } from 'config/constants'
// import { usePriceByPairs } from 'hooks/useBUSDPrice'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
// import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
// import { DCP, USDT } from '@pancakeswap/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { SerializedHistory } from './types'
import { multisenderSelector } from './selectors'
import { fetchMultisenderUserDataAsync, fetchMultisenderPublicDataAsync} from '.'

export const usePollMultisenderWithUserData = () => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useActiveWeb3React()

  useSWRImmutable(
    chainId ? ['publicMultisenderData', chainId] : null,
    async () => {
      dispatch(fetchMultisenderPublicDataAsync({ chainId }))
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  const name = ['multisenderWithUserData', account, chainId]

  useSWRImmutable(
    account && chainId ? name : null,
    async () => {
      const params = { account, chainId }

      dispatch(fetchMultisenderUserDataAsync(params))
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useMultisender = (): SerializedHistory => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => multisenderSelector(chainId), [chainId]))
}
