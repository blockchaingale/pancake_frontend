import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, useToast } from '@pancakeswap/uikit'
import { ZERO_ADDRESS } from 'config/constants'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoRow } from 'components/Layout/Row'
import CircleLoader from 'components/Loader/CircleLoader'
import { ApprovalState } from 'hooks/useApproveCallback'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCreateLaunchpad from '../hooks/useCreatePad'
import { DeFi, FinishData, LaunchpadFormView, Socials, TokenData } from '../types'

const StyledFlex = styled(Flex)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

interface SendCommitButtonPropsType {
  tokenData: TokenData
  deFiData: DeFi
  socials: Socials
  account: string
  approval: ApprovalState
  approveCallback: () => Promise<void>
  approvalSubmitted: boolean
  setApprovalSubmitted: (b: boolean) => void
  approvalForFee: ApprovalState
  approveCallbackForFee: () => Promise<void>
  approvalSubmittedForFee: boolean
  setApprovalSubmittedForFee: (b: boolean) => void
  swapInputError: string
  swapInputErrorForFee: string
  setPresale: Dispatch<SetStateAction<FinishData>>
  setModalView: Dispatch<SetStateAction<LaunchpadFormView>>
}

export default function SendCommitButton({
  tokenData,
  deFiData,
  socials,
  account,
  approval,
  approveCallback,
  approvalSubmitted,
  setApprovalSubmitted,
  approvalForFee,
  approveCallbackForFee,
  approvalSubmittedForFee,
  setApprovalSubmittedForFee,
  swapInputError,
  swapInputErrorForFee,
  setPresale,
  setModalView
}: SendCommitButtonPropsType) {
  const { t } = useTranslation()

  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { onCreateFairLaunchpad } = useCreateLaunchpad()

  const handlePrev = async () => {
    setModalView(LaunchpadFormView.Socials)
  }

  const handleCommit = async () => {
    const receipt = await fetchWithCatchTxError(() => onCreateFairLaunchpad(
      [
        new BigNumber(Date.parse(`${deFiData.startTime.replace("T", " ")} GMT`)).div(1000).toFixed(),
        new BigNumber(Date.parse(`${deFiData.endTime.replace("T", " ")} GMT`)).div(1000).toFixed(),
        new BigNumber(deFiData.softCap).times(10**tokenData.currency.decimals).toFixed(),
        new BigNumber(deFiData.total).times(10**tokenData.tokenDecimals).toFixed(),
        new BigNumber(deFiData.liquidity).times(10).toFixed(),
        new BigNumber(deFiData.lockTime).times(24*3600).toFixed(),
        new BigNumber(tokenData.mainFee).toFixed(),
        new BigNumber(tokenData.tokenFee).toFixed(),
        new BigNumber(deFiData.vestingData.vestingFirst).times(100).toFixed(),
        new BigNumber(deFiData.vestingData.vestingPeriod).times(24*3600).toFixed(),
        new BigNumber(deFiData.vestingData.vestingEach).times(100).toFixed(),
        new BigNumber(deFiData.isMax ? deFiData.maximumBuy : 0).times(10**tokenData.currency.decimals).toFixed(),
      ], 
      [
        tokenData.tokenAddress,
        tokenData.currency.isNative ? ZERO_ADDRESS : tokenData.currency.wrapped.address,
      ],
      [
        socials.description,
        socials.logoUrl,
        socials.website,
        socials.facebook,
        socials.twitter,
        socials.github,
        socials.telegram,
        socials.instagram,
        socials.discord,
        socials.reddit,
        socials.youtube,
        socials.whitelist
      ],
      [
        tokenData.mainFee === "50",
        // deFiData.whitelist,
        deFiData.isVesting,
        deFiData.whitelist
      ]
    ))

    setApprovalSubmitted(false)
    setApprovalSubmittedForFee(false)

    if (receipt?.status) {
      toastSuccess(
        `${t('Launchpad Created')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You\'ve just created launchpad for %symbol%', { symbol: tokenData.tokenSymbol })}
        </ToastDescriptionWithTx>,
      )
      const address = receipt?.events[6]?.args[1] ?? "";
      if (address !== "") setPresale({address})
      setModalView(LaunchpadFormView.Finish)
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
            marginX="10px"
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                {t('Enabling')} <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmitted && approved ? (
              t('%symbol% Enabled', {symbol: tokenData.tokenSymbol})
            ) : (
              t('Enable %asset%', { asset: tokenData.tokenSymbol ?? '' })
            )}
          </CommitButton>}
          {showApproveFlowForFee && <CommitButton
            variant={approvalForFee === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallbackForFee}
            disabled={approvalForFee !== ApprovalState.NOT_APPROVED || approvalSubmittedForFee}
            width="100%"
            marginX="10px"
          >
            {approvalForFee === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                {t('Enabling')} <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmittedForFee && approvedForFee ? (
              t('PCB Enabled')
            ) : (
              t('Enable %asset%', { asset: 'PCB' })
            )}
          </CommitButton>}
        </StyledFlex>
        <StyledFlex>
          <CommitButton
            variant='primary'
            onClick={handlePrev}
            width="100%"
            id="swap-button"
            marginX="10px"
          >
            {t('Prev')}
          </CommitButton>
          <CommitButton
            variant='primary'
            onClick={handleCommit}
            width="100%"
            id="swap-button"
            disabled={!isValid || !approved || pendingTx || !isValidForFee || !approvedForFee}
            marginX="10px"
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
    <StyledFlex>
      <CommitButton
        variant='primary'
        onClick={handlePrev}
        width="100%"
        id="swap-button"
        marginX="10px"
      >
        {t('Prev')}
      </CommitButton>
      <CommitButton
        variant='primary'
        onClick={handleCommit}
        id="swap-button"
        width="100%"
        marginX="10px"
        disabled={!isValid || !approved || pendingTx || !isValidForFee || !approvedForFee}
      >
        {swapInputError || swapInputErrorForFee || 
          (pendingTx ? 
            <AutoRow gap="6px" justify="center">
              {t('Confirming')} <CircleLoader stroke="white" />
            </AutoRow>
          : 
          t('Confirm'))}
      </CommitButton>
    </StyledFlex>
  )
}
