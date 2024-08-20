import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { isAddress } from '@ethersproject/address'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, ChainId, WNATIVE } from '@pancakeswap/sdk'
import { useDebounce } from '@pancakeswap/hooks'
import { Text, Box, Message, Button, Input, useModal, Checkbox, Flex, ChevronDownIcon, MessageText } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useAccount, useChainId } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Row from 'components/Layout/Row'
import { CommonBasesType } from 'components/SearchModal/types'
import { CurrencyLogo } from 'components/Logo'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useToken } from 'hooks/Tokens'
import ProgressSteps from './ProgressSteps'
import { LaunchpadFormView, TokenData } from '../types'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: none;
  border-radius: 8px;
  margin-bottom: 5px;
  height: 40px;
`

export function VerifyTokenForm({
  setModalView,
  tokenData,
  setTokenData
}: {
  setModalView: Dispatch<SetStateAction<LaunchpadFormView>>
  tokenData: TokenData
  setTokenData: Dispatch<SetStateAction<TokenData>>
}) {
  const { t } = useTranslation()
  const {chainId} = useActiveChainId()
  const { address: account } = useAccount()

  const native = useNativeCurrency()

  const [currency, setCurrency] = useState<Currency | null>(tokenData.currency)

  const [tokenError, setTokenError] = useState("");

  const [searchQuery, setSearchQuery] = useState<string>(tokenData.tokenAddress)
  const debouncedQuery = useDebounce(searchQuery, 200)
  const searchToken = useToken(debouncedQuery)

  const [listingOption, setListingOption] = useState(tokenData.listingOption)
  const [mainFee, setMainFee] = useState(tokenData.mainFee)
  const [tokenFee, setTokenFee] = useState(tokenData.tokenFee)

  const handleNext = async () => {
    setTokenData({
      tokenAddress: searchToken.address,
      tokenName: searchToken.name,
      tokenDecimals: searchToken.decimals,
      tokenSymbol: searchToken.symbol,
      currency,
      mainFee,
      tokenFee,
      listingOption
    })
    setModalView(LaunchpadFormView.DeFiInfo)
  }

  const handleCurrencySelect = useCallback(
    (_currency: Currency) => {
      setCurrency(_currency)
    },
    [],
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleCurrencySelect}
      showCommonBases
      selectedCurrency={currency ?? undefined}
      commonBasesType={CommonBasesType.LIQUIDITY}
    />,
    true,
    true,
    'selectCurrencyModal',
  )

  useEffect(() => {
    if (searchToken === null) {
      setTokenError("Unknown address")
    }
    if (searchToken) {
      setTokenError("")
    }
  }, [searchToken])

  useEffect(() => {
    setTokenError("")
    if (!isAddress(searchQuery)) setTokenError("Invalid token address")
    if (searchQuery === "") setTokenError("Token address cannot be blank")
  }, [searchQuery])

  useEffect(() => {
    setCurrency(native)
  }, [chainId])

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Create Launchpad')} subTitle={t('')} />
      <FormContainer>
        <ProgressSteps steps={[false, false, false]} />
        <Box>
          <Text fontSize="16px" bold color="primary">{t("1. Verify Token")}</Text>
          <Text fontSize="12px">{t("Enter the token address and verify")}</Text>
        </Box>
        <Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Token Address*")}</Text>
            <Input
              id="token-search-input"
              placeholder={t('Input token address')}
              scale="md"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {tokenError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {tokenError}
            </Text>}
            {searchToken && 
              <>
                <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
                  <Text>{t("Token Name")}</Text>
                  <Text>{searchToken.name}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
                  <Text>{t("Token Symbol")}</Text>
                  <Text>{searchToken.symbol}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
                  <Text>{t("Token Decimals")}</Text>
                  <Text>{searchToken.decimals}</Text>
                </Flex>
              </>
            }
          </Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Currency")}</Text>
            <Flex alignItems="center" flexDirection={["column", "column", "row"]}>
              <StyledButton
                endIcon={<ChevronDownIcon />}
                onClick={() => {
                  onPresentCurrencyModal()
                }}
              >
                {currency ? (
                  <Row>
                    <CurrencyLogo currency={currency} />
                    <Text ml="8px">{currency.symbol}</Text>
                  </Row>
                ) : (
                  <Text ml="8px">{t('Select a Token')}</Text>
                )}
              </StyledButton>
              <Text color="text" fontSize="14px" ml="20px">{t("Users will pay with %symbol% for your token", {symbol: currency.symbol})}</Text>
            </Flex>
          </Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Fee Options")}</Text>
            <Flex
              alignItems="center"
              onClick={
                () => {
                  setMainFee("50")
                  setTokenFee("0")
                }
              }
            >
              <Checkbox
                scale="sm"
                checked={mainFee === "50"}
                value="50"
                readOnly
              />
              <Text ml="20px">{t("5% %symbol% raised only", {symbol: currency.symbol})}</Text>
            </Flex>
            <Flex 
              alignItems="center" 
              onClick={
                () => {
                  setMainFee("20")
                  setTokenFee("20")
                }
              }
            >
              <Checkbox
                scale="sm"
                checked={mainFee === "20"}
                value="20"
                readOnly
              />
              <Text ml="20px">{t("2% %symbol% raised + 2% token sold", {symbol: currency.symbol})}</Text>
            </Flex>
          </Box>
          <Box>
            <Text fontSize="12px" color="primary">{t("Listing Options")}</Text>
            <Flex alignItems="center" onClick={() => setListingOption(true)}>
              <Checkbox
                scale="sm"
                checked={listingOption}
                value="auto"
                readOnly
              />
              <Text ml="20px">{t("Auto Listing")}</Text>
            </Flex>
            <Flex alignItems="center" onClick={() => setListingOption(false)}>
              <Checkbox
                scale="sm"
                checked={!listingOption}
                value="manual"
                readOnly
              />
              <Text ml="20px">{t("Manual Listing")}</Text>
            </Flex>
            {!listingOption && <Text color="text" fontSize="14px">{t("For manual listing, We won't charge tokens for liquidity. You may withdraw %symbol% after the pool ends then do DEX listing yourself.", {symbol: currency.symbol})}</Text>}
            {listingOption && <Text color="text" fontSize="14px">{t("For auto listing, after you finalize the pool your token will be auto listed on Duckstail DEX.", {symbol: currency.symbol})}</Text>}
          </Box>
        </Box>
        {currency.wrapped.address !== WNATIVE[chainId].address && <Message variant="warning" icon={false} p="8px 12px">
          <MessageText color="text">
            <span>{t('Do not use this currency for auto liquidity tokens, or tokens that depend on WETH pair. It will lead to error when finalizing the pool or transfering the tokens (for example Liquidity Generator Token, BabyToken, Buyback Baby Token).')}</span>
          </MessageText>
        </Message>}
        {!account ? <ConnectWalletButton /> : <Button
          onClick={handleNext}
          disabled={tokenError !== "" || searchQuery === ""}
        >{t("Next")}</Button>}
      </FormContainer>
    </Box>
  )
}
