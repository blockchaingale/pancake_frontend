import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Box, Flex, LinkExternal } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { PCB, arbitrumTokens } from '@pancakeswap/tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
// import Row from 'components/Layout/Row'
import { CurrencyLogo } from 'components/Logo'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import { useAccount, useChainId } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getMultiSenderAddress } from 'utils/addressHelpers'
import { usePollMultisenderWithUserData, useMultisender } from 'state/multisend/hooks'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'
import DataTable from './DataTable'
import SendCommitButton from './SendCommitButton'
import { useAccountInfo } from '../hooks/useAccountInfo'

export function QuoteForm({
  setModalView,
  data,
  tag,
  currency,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  data: DataType[]
  tag: string
  currency: Currency | null
}) {
  const { t } = useTranslation()
  const {chainId} = useActiveChainId()
  const { address: account } = useAccount()

  const { fee: feeRate } = useMultisender()

  usePollMultisenderWithUserData()

  const amounts = data.map((row) => Math.floor(row.amount * 10 ** currency.decimals)/10 ** currency.decimals)
  const totalAmounts = amounts.reduce((amount0, amount1) => amount0 + amount1, 0)

  const fee = new BigNumber(feeRate).times(data.length).div(10**18)

  const {
    parsedAmount,
    inputError
  } = useAccountInfo(totalAmounts.toFixed(currency.decimals), currency)

  const {
    parsedAmount: parsedAmountForFee,
    inputError: inputErrorForFee
  } = useAccountInfo(fee.toFixed(18), PCB[chainId])

  const [approval, approveCallback] = useApproveCallback(parsedAmount, getMultiSenderAddress(chainId))
  const [approvalForFee, approveCallbackForFee] = useApproveCallback(parsedAmountForFee, getMultiSenderAddress(chainId))

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const [approvalSubmittedForFee, setApprovalSubmittedForFee] = useState<boolean>(false)

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
    if (approvalForFee === ApprovalState.PENDING) {
      setApprovalSubmittedForFee(true)
    }
  }, [approval, approvalSubmitted, approvalForFee, approvalSubmittedForFee])

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Confirm Allocation')} subTitle={t('Let review your information')} backTo={() => setModalView(CryptoFormView.Input)} />
      <FormContainer>
        <Box>
          <Flex width="100%" px="20px" my="10px">
            <CurrencyLogo size="32px" currency={currency} />
            <Text fontSize="20px" ml="8px">{currency.symbol}</Text>
          </Flex>
          {!currency.isNative && <Flex width="100%" justifyContent="space-between" px="20px" mb="10px">
            <Text>{t("Token Address")}</Text>
            <Text>{`${currency.wrapped.address.substring(0, 6)}...${currency.wrapped.address.substring(currency.wrapped.address.length - 4)}`}</Text>
          </Flex>}
          <Text mt="30px">{t("Allocation")}</Text>
          <DataTable data={data} />
          <Flex width="100%" justifyContent="space-between" px="20px" mt="50px">
            <Text>{t("Total Senders")}</Text>
            <Text>{data.length}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
            <Text>{t("Total Amount to send")}</Text>
            <Text>{Number(totalAmounts.toFixed(currency.decimals))}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
            <Text>{t("Tag")}</Text>
            <Text>{tag}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
            <Text>{t("Send Fee")}</Text>
            <Text>{fee.toJSON()} PCB</Text>
          </Flex>
        </Box>
        <SendCommitButton
          data={data}
          tag={tag}
          account={account}
          approval={approval}
          approveCallback={approveCallback}
          approvalSubmitted={approvalSubmitted}
          setApprovalSubmitted={setApprovalSubmitted}
          approvalForFee={approvalForFee}
          approveCallbackForFee={approveCallbackForFee}
          approvalSubmittedForFee={approvalSubmittedForFee}
          setApprovalSubmittedForFee={setApprovalSubmittedForFee}
          currency={currency}
          swapInputError={inputError}
          swapInputErrorForFee={inputErrorForFee}
          // parsedAmount={parsedAmount}
          setModalView={setModalView}
        />
        <LinkExternal href={`/swap?outputCurrency=${PCB[chainId].address}`} style={{ alignSelf: "center" }}>
          {t("Get %symbol%", { symbol: 'PCB' })}
        </LinkExternal>
      </FormContainer>
    </Box>
  )
}
