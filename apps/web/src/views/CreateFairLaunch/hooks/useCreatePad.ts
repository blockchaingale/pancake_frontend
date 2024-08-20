import { useCallback } from 'react'
import { createLaunchpad, createFairLaunchpad } from 'utils/calls'
import { useLaunchpadFactory } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useCreateLaunchpad = () => {
  const gasPrice = useGasPrice()
  const launchpad = useLaunchpadFactory()

  const handleCreateLaunchpad = useCallback(
    async (values: string[], addresses: string[], strings: string[], options: boolean[]) => {
      return createLaunchpad(launchpad, values, addresses, strings, options, gasPrice)
    },
    [launchpad, gasPrice],
  )

  const handleCreateFairLaunchpad = useCallback(
    async (values: string[], addresses: string[], strings: string[], options: boolean[]) => {
      return createFairLaunchpad(launchpad, values, addresses, strings, options, gasPrice)
    },
    [launchpad, gasPrice],
  )

  return { onCreateLaunchpad: handleCreateLaunchpad, onCreateFairLaunchpad: handleCreateFairLaunchpad }
}

export default useCreateLaunchpad
