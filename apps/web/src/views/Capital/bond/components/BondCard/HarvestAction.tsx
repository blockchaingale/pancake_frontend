import { useTranslation } from '@pancakeswap/localization'
import {
  Button,
  Flex,
  Heading,
  useToast,
  Balance,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'

import { TransactionResponse } from '@ethersproject/providers'
import { useDCPUSDTPrice } from 'state/capital/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { Token } from '@pancakeswap/sdk'
import { SerializedBond } from '@pancakeswap/capital'

interface FarmCardActionsProps {
  bond: SerializedBond
  onReward?: () => Promise<TransactionResponse>
  onDone?: () => void
}

const HarvestAction: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  bond,
  onReward,
  onDone,
}) => {
  const { address: account } = useAccount()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { t } = useTranslation()
  // const cakePrice = useDCPUSDTPrice()
  // const rawEarningsBalance = account ? getBalanceAmount(bond.userData.pendingPayout) : BIG_ZERO
  // const displayBalance = rawEarningsBalance.toFixed(5, BigNumber.ROUND_DOWN)
  // const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(cakePrice).toNumber() : 0

  const pendingPayout = new BigNumber(bond.userData.pendingPayout)

  const onClickHarvestButton = () => {
    handleHarvest()
  }

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onReward()
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Claimed')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% bond have been sent to your wallet!', { symbol: 'DCP' })}
        </ToastDescriptionWithTx>,
      )
      onDone?.()
    }
  }

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading color={pendingPayout.eq(0) ? 'textDisabled' : 'text'}>{pendingPayout.toFixed(2, BigNumber.ROUND_DOWN)} DCP</Heading>
        {/* {earningsBusd > 0 && (
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
        )} */}
        {/* <Balance fontSize="12px" color="textSubtle" decimals={2} value={pendingPayout.toNumber()} unit=" DCP" prefix="~" /> */}
      </Flex>
      <Button disabled={pendingPayout.eq(0) || pendingTx} onClick={onClickHarvestButton}>
        {pendingTx ? t('Claiming') : t('Claim')}
      </Button>
    </Flex>
  )
}

export default HarvestAction
