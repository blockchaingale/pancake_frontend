import { useCallback } from 'react'
import { harvestBond } from 'utils/calls'
import { useBond } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useHarvestBond = (bondAddress: string, account: string, stake: boolean) => {
  const bondContract = useBond(bondAddress)
  const gasPrice = useGasPrice()

  const handleHarvest = useCallback(async () => {
    return harvestBond(bondContract, account, stake, gasPrice)
  }, [account, stake, bondContract, gasPrice])

  return { onReward: handleHarvest }
}

export default useHarvestBond
