import { useCallback } from 'react'
import { unstakeVault } from 'utils/calls'
import { useDcpStaking } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useUnstakeVault = () => {
  const stakingContract = useDcpStaking()
  const gasPrice = useGasPrice()

  const handleUnstake = useCallback(async (amount: string) => {
    return unstakeVault(stakingContract, amount, true, gasPrice)
  }, [stakingContract, gasPrice])

  return { onUnstake: handleUnstake }
}

export default useUnstakeVault
