import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SLOW_INTERVAL } from 'config/constants'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { launchpadsSelector } from './selectors'
import { fetchLaunchpadsPublicDataAsync } from '.'
import { SerializedLaunchpadsState } from './types'

export const usePollLaunchpads = (size: number, cursor: number) => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useActiveWeb3React()

  useSWRImmutable(
    chainId ? ['publicLaunchpadsData', size, cursor, chainId] : null,
    async () => {
      dispatch(fetchLaunchpadsPublicDataAsync({ chainId, size, cursor }))
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useLaunchpads = (): SerializedLaunchpadsState => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => launchpadsSelector(chainId), [chainId]))
}
