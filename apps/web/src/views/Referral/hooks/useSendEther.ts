import { useCallback } from 'react'
import { multiSendEther } from 'utils/calls'
import { useMultisender } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useSendEther = () => {
  const gasPrice = useGasPrice()
  const senderContract = useMultisender()

  const handleSendEther = useCallback(
    async (totalAmount: string, addresses: string[], amounts: string[], tag: string) => {
      return multiSendEther(senderContract, totalAmount, addresses, amounts, tag, gasPrice)
    },
    [senderContract, gasPrice],
  )

  return { onSendEther: handleSendEther }
}

export default useSendEther
