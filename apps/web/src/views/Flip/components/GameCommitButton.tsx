import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { useToast } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Column from 'components/Layout/Column'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import CircleLoader from 'components/Loader/CircleLoader'
// import SettingsModal, { withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { ApprovalState } from 'hooks/useApproveCallback'
// import { Field } from 'state/swap/actions'
import ProgressSteps from 'views/Swap/components/ProgressSteps'
import useCatchTxError from 'hooks/useCatchTxError'
// import { ToastDescriptionWithTx } from 'components/Toast'
// import useBurnToken from 'views/Bridge/hooks/useBurnToken'

interface GameCommitButtonPropsType {
  account: string
  approval: ApprovalState
  approveCallback: () => Promise<void>
  approvalSubmitted: boolean
  // setApprovalSubmitted: (b: boolean) => void
  currency?: Currency
  swapInputError: string
  // parsedAmount: CurrencyAmount<Currency>
  onStake: (v: string) => void
}

export default function GameCommitButton({
  account,
  approval,
  approveCallback,
  approvalSubmitted,
  // setApprovalSubmitted,
  currency,
  swapInputError,
  // parsedAmount,
  onStake
}: GameCommitButtonPropsType) {
  const { t } = useTranslation()

  // const { toastSuccess } = useToast()
  const { loading: pendingTx } = useCatchTxError()

  // const { onStake } = useBurnToken(pid, false)

  // const onStake = (v: string) => {}

  // Handlers
  // const handleSwap = async () => {
  //   const receipt = await fetchWithCatchTxError(() => onStake(parsedAmount.toFixed(0)))
  //   setApprovalSubmitted(false)

  //   if (receipt?.status) {
  //     toastSuccess(
  //       `${t('You have already bet!')}!`,
  //       <ToastDescriptionWithTx txHash={receipt.transactionHash}>
  //         {t('Your funds have been locked in the bridge pool. You will receive the funds in 1~2 minutes')}
  //       </ToastDescriptionWithTx>,
  //     )
  //   }
  // }

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

  const isValid = !swapInputError
  const approved = approval === ApprovalState.APPROVED

  if (showApproveFlow) {
    return (
      <>
        <RowBetween>
          <CommitButton
            variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallback}
            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
            width="48%"
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
          </CommitButton>
          <CommitButton
            variant='primary'
            onClick={() => {console.log("Bet");}}
            width="48%"
            id="swap-button"
            disabled={!isValid || !approved || pendingTx}
          >
            {
              pendingTx ? 
                <AutoRow gap="6px" justify="center">
                  {t('Betting')} <CircleLoader stroke="white" />
                </AutoRow> 
              : 
                t('Bet')
            }
          </CommitButton>
        </RowBetween>
        <Column style={{ marginTop: '1rem' }}>
          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
        </Column>
      </>
    )
  }

  return (
    <>
      <CommitButton
        variant='primary'
        onClick={() => {console.log("Bet");}}
        id="swap-button"
        width="100%"
        disabled={!isValid || !approved || pendingTx}
      >
        {swapInputError ||
          (pendingTx ? 
            <AutoRow gap="6px" justify="center">
              {t('Betting')} <CircleLoader stroke="white" />
            </AutoRow>
          : 
          t('Bet'))}
      </CommitButton>
    </>
  )
}
