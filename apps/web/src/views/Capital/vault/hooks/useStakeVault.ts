import { useCallback } from 'react'
import { stakeVault } from 'utils/calls'
import { useDcpStakingHelper } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useStakeVault = (account: string) => {
  const stakingHelperContract = useDcpStakingHelper()
  const gasPrice = useGasPrice()

  const handleStake = useCallback(async (amount: string) => {
    return stakeVault(stakingHelperContract, amount, account, gasPrice)
  }, [stakingHelperContract, gasPrice, account])

  return { onStake: handleStake }
}

export default useStakeVault
