import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SLOW_INTERVAL } from 'config/constants'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { launchpadSelector } from './selectors'
import { fetchLaunchpadPublicDataAsync, fetchLaunchpadUserDataAsync } from '.'
import { SerializedLaunchpadState } from './types'

export const usePollLaunchpadWithUserData = (address: string) => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useActiveWeb3React()

  useSWRImmutable(
    chainId ? ['publicLaunchpadData', address, chainId] : null,
    async () => {
      dispatch(fetchLaunchpadPublicDataAsync({ address, chainId }))
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  const name = ['launchpadWithUserData', account, address, chainId]

  useSWRImmutable(
    account && chainId ? name : null,
    async () => {
      const params = { account, address, chainId }

      dispatch(fetchLaunchpadUserDataAsync(params))
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useLaunchpad = (pool: string): SerializedLaunchpadState => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => launchpadSelector(chainId, pool), [chainId, pool]))
}
