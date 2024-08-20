import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { PCB, USDT, arbitrumTokens } from '@pancakeswap/tokens'
import { Text, Box, Message, Button, Flex, MessageText } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useAccount, useChainId } from 'wagmi'
import addresses from 'config/constants/contracts'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useToken } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useLaunchpadFee from 'hooks/useLaunchpadFee'
import { getLaunchpadFactoryAddress } from 'utils/addressHelpers'
import ProgressSteps from './ProgressSteps'
import { useAccountInfo } from '../hooks/useAccountInfo'
import { DeFi, FinishData, LaunchpadFormView, Socials, TokenData } from '../types'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'
import SendCommitButton from './SendCommitButton'

export function ReviewForm({
  setModalView,
  tokenData,
  deFiData,
  socials,
  setPresale
}: {
  setModalView: Dispatch<SetStateAction<LaunchpadFormView>>
  tokenData: TokenData
  deFiData: DeFi
  socials: Socials
  setPresale: Dispatch<SetStateAction<FinishData>>
}) {
  const { t } = useTranslation()
  const {chainId} = useActiveChainId()
  const { address: account } = useAccount()

  const {
    parsedAmount,
    inputError
  } = useAccountInfo(deFiData.totalAmount, useToken(tokenData.tokenAddress))

  const serviceFee = useLaunchpadFee()

  const {
    parsedAmount: parsedAmountForFee,
    inputError: inputErrorForFee
  } = useAccountInfo((Number(serviceFee) / 10**PCB[chainId].decimals).toString(), PCB[chainId])

  const [approval, approveCallback] = useApproveCallback(parsedAmount, getLaunchpadFactoryAddress(chainId))
  const [approvalForFee, approveCallbackForFee] = useApproveCallback(parsedAmountForFee, getLaunchpadFactoryAddress(chainId))

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
      <FormHeader title={t('Create Launchpad')} subTitle={t('')} />
      <FormContainer>
        <ProgressSteps steps={[true, true, true]} />
        <Box>
          <Text fontSize="16px" bold color="primary">{t("4. Finish")}</Text>
          <Text fontSize="12px">{t("Review your information")}</Text>
        </Box>
        <Box>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Total token")}</Text>
            <Text>{deFiData.totalAmount} {tokenData.tokenSymbol}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Token Name")}</Text>
            <Text>{tokenData.tokenName}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Token Symbol")}</Text>
            <Text>{tokenData.tokenSymbol}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Token Decimals")}</Text>
            <Text>{tokenData.tokenDecimals}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Presale Rate")}</Text>
            <Text>{deFiData.presaleRate} {tokenData.tokenSymbol}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Listing Rate")}</Text>
            <Text>{deFiData.listingRate} {tokenData.tokenSymbol}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Sale Method")}</Text>
            <Text>{deFiData.whitelist ? "Whitelist Only" : "Public"}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Soft Cap")}</Text>
            <Text>{deFiData.softCap} {tokenData.currency.symbol}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Hard Cap")}</Text>
            <Text>{deFiData.hardCap} {tokenData.currency.symbol}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Unsold tokens")}</Text>
            <Text>{deFiData.refundType ? "Refund" : "Burn"}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Minimum Buy")}</Text>
            <Text>{deFiData.minimumBuy} {tokenData.currency.symbol}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Maximum Buy")}</Text>
            <Text>{deFiData.maximumBuy} {tokenData.currency.symbol}</Text>
          </Flex>
          {tokenData.listingOption && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Liquidity")}</Text>
            <Text>{deFiData.liquidity} %</Text>
          </Flex>}
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Start Time")}</Text>
            <Text>{deFiData.startTime} (UTC)</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("End Time")}</Text>
            <Text>{deFiData.endTime} (UTC)</Text>
          </Flex>
          {tokenData.listingOption && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Liquidity Lockup Time")}</Text>
            <Text>{deFiData.lockTime} days</Text>
          </Flex>}
          {socials.whitelist !== "" && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Whitelist Approbation Link")}</Text>
            <Text>{socials.whitelist}</Text>
          </Flex>}
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Website")}</Text>
            <Text>{socials.website}</Text>
          </Flex>
          {socials.facebook !== "" && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Facebook")}</Text>
            <Text>{socials.facebook}</Text>
          </Flex>}
          {socials.twitter !== "" && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Twitter")}</Text>
            <Text>{socials.twitter}</Text>
          </Flex>}
          {socials.github !== "" && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Github")}</Text>
            <Text>{socials.github}</Text>
          </Flex>}
          {socials.telegram !== "" && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Telegram")}</Text>
            <Text>{socials.telegram}</Text>
          </Flex>}
          {socials.instagram !== "" && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Instagram")}</Text>
            <Text>{socials.instagram}</Text>
          </Flex>}
          {socials.discord !== "" && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Discord")}</Text>
            <Text>{socials.discord}</Text>
          </Flex>}
          {socials.reddit !== "" && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Reddit")}</Text>
            <Text>{socials.reddit}</Text>
          </Flex>}
          {socials.description !== "" && <><Flex width="100%" justifyContent="space-between" px="5px" mb="5px">
            <Box mr="60px"><Text color="primary">{t("Description")}</Text></Box>
            <Text textAlign="right">{socials.description}</Text>
          </Flex></>}
          {socials.youtube !== "" && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Youtube Video")}</Text>
            <Text>{socials.youtube}</Text>
          </Flex>}
        </Box>
        <Message variant="warning" icon={false} p="8px 12px">
          <MessageText color="text">
            <span>{t('Please exclude address %address% from fees, rewards, max tx amount to start creating pools.', {address: addresses.launchpadFactory[chainId]})}</span>
          </MessageText>
        </Message>
        <Message variant="warning" icon={false} p="8px 12px">
          <MessageText color="text">
            <span>{t('For tokens with burns, rebase or other special transfers please ensure that you have a way to whitelist multiple addresses or turn off the special transfer events (By setting fees to 0 for example for the duration of the presale)')}</span>
          </MessageText>
        </Message>
        {!account ? <ConnectWalletButton /> : <SendCommitButton
          tokenData={tokenData}
          deFiData={deFiData}
          socials={socials}
          account={account}
          approval={approval}
          approveCallback={approveCallback}
          approvalSubmitted={approvalSubmitted}
          setApprovalSubmitted={setApprovalSubmitted}
          approvalForFee={approvalForFee}
          approveCallbackForFee={approveCallbackForFee}
          approvalSubmittedForFee={approvalSubmittedForFee}
          setApprovalSubmittedForFee={setApprovalSubmittedForFee}
          swapInputError={inputError}
          swapInputErrorForFee={inputErrorForFee}
          setPresale={setPresale}
          setModalView={setModalView}
        />}
      </FormContainer>
    </Box>
  )
}
