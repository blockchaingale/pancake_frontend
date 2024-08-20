import { useCallback } from 'react'
import { MaxUint256 } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useApprovePool = (token: Contract, pool: string) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithGasPrice(token, 'approve', [pool, MaxUint256])
  }, [token, pool, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApprovePool
