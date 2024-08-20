import { useCallback } from 'react'
import { MaxUint256 } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useApproveBond = (lpContract: Contract, bondAddress: string) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithGasPrice(lpContract, 'approve', [bondAddress, MaxUint256])
  }, [lpContract, bondAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApproveBond
