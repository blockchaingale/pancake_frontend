import { useCallback } from 'react'
import { mintBond } from 'utils/calls'
import { useBond } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useMintBond = (bondAddress: string, account: string, maxPremium: string) => {
  const bondContract = useBond(bondAddress)
  const gasPrice = useGasPrice()

  const handleMint = useCallback(async (amount: string) => {
    return mintBond(bondContract, amount, maxPremium, account, gasPrice)
  }, [bondContract, gasPrice, account, maxPremium])

  return { onMint: handleMint }
}

export default useMintBond
