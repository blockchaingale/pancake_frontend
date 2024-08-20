import { useCallback } from 'react'
// import { useAccount } from 'wagmi'
import { TransactionResponse } from '@ethersproject/providers'
import { useTranslation } from '@pancakeswap/localization'
import { Heading, useToast, Button, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { SerializedBond } from '@pancakeswap/capital'
import { useAppDispatch } from 'state'
import { fetchCapitalUserDataAsync } from 'state/capital'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
// import { useERC20 } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useHarvestBond from '../../../../hooks/useHarvestBond'

import { ActionContainer, ActionContent, ActionTitles } from "./styles";

interface HarvestActionProps {
  bond: SerializedBond
  onReward?: () => Promise<TransactionResponse>
  onDone?: () => void
}

export const HarvestActionContainer = ({ children, ...props }) => {
  const { bond } = props;
  const { account, chainId } = useActiveWeb3React()
  const { onReward } = useHarvestBond(bond.bondAddress, account, false)
  const dispatch = useAppDispatch()

  const onDone = useCallback(
    () => dispatch(fetchCapitalUserDataAsync({ account, ids: [bond.id], chainId })),
    [account, dispatch, chainId, bond.id],
  )

  return children({ bond, onDone, onReward })
}

export const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  bond,
  onReward,
  onDone,
}) => {
  const { t } = useTranslation()
  // const { address: account } = useAccount()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()  

  const earnings = new BigNumber(bond?.userData.pendingPayout) ?? BIG_ZERO

  // const cakePrice = useDCPUSDTPrice()
  // const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
  // const displayBalance = rawEarningsBalance.toFixed(5, BigNumber.ROUND_DOWN)
  // const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(cakePrice).toNumber() : 0

  const onClickHarvestButton = () => {
    handleHarvest()
  }

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onReward()
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'DCP' })}
        </ToastDescriptionWithTx>,
      )
      onDone?.()
    }
  }

  return (
    <ActionContainer style={{ minHeight: 124.5 }}>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Pending")}
        </Text>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pl="4px">
          {bond.displayName}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pl="4px">
          {t("Bond")}
        </Text>
      </ActionTitles>
      <ActionContent>
        {/* <div>
          {earningsBusd > 0 && (
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
          )}
        </div> */}
        <Heading color={earnings.eq(0) ? 'textDisabled' : 'text'}>{earnings.toFixed(2, BigNumber.ROUND_DOWN)} DCP</Heading>
        <Button ml="4px" disabled={earnings.eq(0) || pendingTx } onClick={onClickHarvestButton}>
          {pendingTx ? t("Claiming") : t("Claim")}
        </Button>
      </ActionContent>
    </ActionContainer>
  );
}

export default HarvestAction