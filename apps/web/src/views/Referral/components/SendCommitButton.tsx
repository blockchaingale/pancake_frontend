import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { Flex, useToast } from '@pancakeswap/uikit'
import { BIG_TEN } from '@pancakeswap/utils/bigNumber'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
// import Column from 'components/Layout/Column'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import CircleLoader from 'components/Loader/CircleLoader'
import { ApprovalState } from 'hooks/useApproveCallback'
// import ProgressSteps from 'views/Swap/components/ProgressSteps'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import useSendToken from '../hooks/useSendToken'
import useSendEther from '../hooks/useSendEther'

const StyledFlex = styled(Flex)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

interface SendCommitButtonPropsType {
  data: DataType[]
  tag: string
  account: string
  approval: ApprovalState
  approveCallback: () => Promise<void>
  approvalSubmitted: boolean
  setApprovalSubmitted: (b: boolean) => void
  approvalForFee: ApprovalState
  approveCallbackForFee: () => Promise<void>
  approvalSubmittedForFee: boolean
  setApprovalSubmittedForFee: (b: boolean) => void
  currency?: Currency
  swapInputError: string
  swapInputErrorForFee: string
  parsedAmount?: CurrencyAmount<Currency>
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
}

export default function SendCommitButton({
  data,
  tag,
  account,
  approval,
  approveCallback,
  approvalSubmitted,
  setApprovalSubmitted,
  approvalForFee,
  approveCallbackForFee,
  approvalSubmittedForFee,
  setApprovalSubmittedForFee,
  currency,
  swapInputError,
  swapInputErrorForFee,
  // parsedAmount,
  setModalView
}: SendCommitButtonPropsType) {
  const { t } = useTranslation()

  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { onSendToken } = useSendToken()
  const { onSendEther } = useSendEther()

  const addresses = data.map((row) => row.address)
  const amounts = data.map((row) => Math.floor(row.amount * 10 ** currency.decimals) / 10 ** currency.decimals)
  const amountsInString = data.map((row) => new BigNumber(row.amount).times(BIG_TEN.pow(currency.decimals)).toFixed())
  const totalAmount = amounts.reduce((sum, current) => sum + current, 0)
  const handleCommit = async () => {
    const receipt = currency.isNative ? 
      await fetchWithCatchTxError(() => onSendEther(totalAmount.toFixed(currency.decimals), addresses, amountsInString, tag)) : 
      await fetchWithCatchTxError(() => onSendToken(currency.wrapped.address, addresses, amountsInString, tag))
    setApprovalSubmitted(false)
    setApprovalSubmittedForFee(false)

    if (receipt?.status) {
      toastSuccess(
        `${t('Confirmed')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% have been sent to the receivers!', { symbol: currency.symbol })}
        </ToastDescriptionWithTx>,
      
      )
      setModalView(CryptoFormView.Input)
    }
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const showApproveFlowForFee =
    !swapInputError &&
    (approvalForFee === ApprovalState.NOT_APPROVED ||
      approvalForFee === ApprovalState.PENDING ||
      (approvalSubmittedForFee && approvalForFee === ApprovalState.APPROVED))

  const isValid = !swapInputError
  const isValidForFee = !swapInputErrorForFee

  const approved = approval === ApprovalState.APPROVED
  const approvedForFee = approvalForFee === ApprovalState.APPROVED

  if (showApproveFlow || showApproveFlowForFee) {
    return (
      <>
        <StyledFlex>
          {showApproveFlow && <CommitButton
            variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallback}
            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
            width="100%"
            margin="10px"
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                {t('Enabling')} <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmitted && approved ? (
              t('Enabled')
            ) : (
              t('Enable %asset%', { asset: currency?.symbol ?? '' })
            )}
          </CommitButton>}
          {showApproveFlowForFee && <CommitButton
            variant={approvalForFee === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallbackForFee}
            disabled={approvalForFee !== ApprovalState.NOT_APPROVED || approvalSubmittedForFee}
            width="100%"
            margin="10px"
          >
            {approvalForFee === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                {t('Enabling')} <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmittedForFee && approvedForFee ? (
              t('Enabled')
            ) : (
              t('Enable %asset%', { asset: 'PCB' })
            )}
          </CommitButton>}
          <CommitButton
            variant='primary'
            onClick={handleCommit}
            width="100%"
            id="swap-button"
            disabled={!isValid || !approved || pendingTx || !isValidForFee || !approvedForFee}
            margin="10px"
          >
            {
              pendingTx ? 
                <AutoRow gap="6px" justify="center">
                  {t('Confirming')} <CircleLoader stroke="white" />
                </AutoRow> 
              : 
                t('Confirm')
            }
          </CommitButton>
        </StyledFlex>
        {/* <Column style={{ marginTop: '1rem' }}>
          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
        </Column> */}
      </>
    )
  }

  return (
    <>
      <CommitButton
        variant='primary'
        onClick={handleCommit}
        id="swap-button"
        width="100%"
        disabled={!isValid || !approved || pendingTx || !isValidForFee || !approvedForFee}
      >
        {swapInputError ||
          (pendingTx ? 
            <AutoRow gap="6px" justify="center">
              {t('Confirming')} <CircleLoader stroke="white" />
            </AutoRow>
          : 
          t('Confirm'))}
      </CommitButton>
    </>
  )
}
