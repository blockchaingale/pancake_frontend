import { useCallback } from 'react'
import { MaxUint256 } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useApprove = (contract: Contract, address: string) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithGasPrice(contract, 'approve', [address, MaxUint256])
  }, [contract, address, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApprove
