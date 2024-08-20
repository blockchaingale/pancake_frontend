import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { ethers, ContractFactory } from "ethers"
import { isAddress } from '@ethersproject/address'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, ChainId, WNATIVE, Token } from '@pancakeswap/sdk'
// import { useDebounce } from '@pancakeswap/hooks'
import { Text, Box, Button, Input, useModal, Checkbox, Flex, ChevronDownIcon, useToast } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useAccount, useChainId, useSigner } from 'wagmi'
import { ROUTER_ADDRESS } from 'config/constants/exchange'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Row, { AutoRow } from 'components/Layout/Row'
import { CommonBasesType } from 'components/SearchModal/types'
import { CurrencyLogo } from 'components/Logo'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { ToastDescriptionWithTx } from 'components/Toast'
import CircleLoader from 'components/Loader/CircleLoader'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import useCatchTxError from 'hooks/useCatchTxError'
import { TokenFormView, TokenData, FinishData } from '../types'
import { tokenABI, byteCodes, feeAddress, fee, dividendTrackerAddresses, feeReceivers } from '../constants'
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
  setTokenData,
  setFinishData
}: {
  setModalView: Dispatch<SetStateAction<TokenFormView>>
  tokenData: TokenData
  setTokenData: Dispatch<SetStateAction<TokenData>>
  setFinishData: Dispatch<SetStateAction<FinishData>>
}) {
  const { t } = useTranslation()
  const {chainId} = useActiveChainId()
  const native = useNativeCurrency()
  const { address: account } = useAccount()
  const { data: signer } = useSigner()

  const { toastSuccess } = useToast()
  const { fetchWithCatchTxErrorForDeploy, loading: pendingTx } = useCatchTxError()

  const [name, setName] = useState(tokenData.name)
  const [symbol, setSymbol] = useState(tokenData.symbol)
  const [decimals, setDecimals] = useState(tokenData.decimals)
  const [totalSupply, setTotalSupply] = useState(tokenData.totalSupply)
  const [type, setType] = useState(tokenData.type)

  const [nameError, setNameError] = useState("")
  const [symbolError, setSymbolError] = useState("")
  const [decimalsError, setDecimalsError] = useState("")
  const [totalSupplyError, setTotalSupplyError] = useState("")

  const [taxFee1, setTaxFee1] = useState(tokenData.liquidityGen?.taxFee1 ?? "")
  const [liquidityFee1, setLiquidityFee1] = useState(tokenData.liquidityGen?.liquidityFee1 ?? "")
  const [charityAddr1, setCharityAddr1] = useState(tokenData.liquidityGen?.charityAddr1 ?? "")
  const [charityFee1, setCharityFee1] = useState(tokenData.liquidityGen?.charityFee1 ?? "")

  const [taxFee1Error, setTaxFee1Error] = useState("")
  const [liquidityFee1Error, setLiquidityFee1Error] = useState("")
  const [charityAddr1Error, setCharityAddr1Error] = useState("")
  const [charityFee1Error, setCharityFee1Error] = useState("")

  const [totalFee1Error, setTotalFee1Error] = useState("")

  // const [rewardToken, setRewardToken] = useState(tokenData.baby.rewardToken2 ?? tokenData.buyBackBaby.rewardToken3 ?? "")
  const [currency, setCurrency] = useState<Token | null>(() => tokenData.baby?.rewardToken2 ?? tokenData.buyBackBaby?.rewardToken3 ?? WNATIVE[chainId] ?? null)
  const [minBalance2, setMinBalance2] = useState(tokenData.baby?.minBalance2 ?? "")
  const [rewardFee2, setRewardFee2] = useState(tokenData.baby?.rewardFee2 ?? "")
  const [liquidity2, setLiquidity2] = useState(tokenData.baby?.liquidity2 ?? "")
  const [charityAddr2, setCharityAddr2] = useState(tokenData.baby?.charityAddr2 ?? "")
  const [charityFee2, setCharityFee2] = useState(tokenData.baby?.charityFee2 ?? "")

  // const [rewardToken2Error, setRewardToken2Error] = useState("")
  const [minBalance2Error, setMinBalance2Error] = useState("")
  const [rewardFee2Error, setRewardFee2Error] = useState("")
  const [liquidity2Error, setLiquidity2Error] = useState("")
  const [charityAddr2Error, setCharityAddr2Error] = useState("")
  const [charityFee2Error, setCharityFee2Error] = useState("")

  const [totalFee2Error, setTotalFee2Error] = useState("")

  
  // const [rewardToken3, setRewardToken3] = useState(tokenData.buyBackBaby.rewardToken3 ?? "")
  const [liquidityFee3, setLiquidityFee3] = useState(tokenData.buyBackBaby?.liquidityFee3 ?? "")
  const [buyBackFee3, setBuyBackFee3] = useState(tokenData.buyBackBaby?.buyBackFee3 ?? "")
  const [reflectionFee3, setReflectionFee3] = useState(tokenData.buyBackBaby?.reflectionFee3 ?? "")
  const [charityFee3, setCharityFee3] = useState(tokenData.buyBackBaby?.charityFee3 ?? "")

  // const [rewardToken3Error, setRewardToken3Error] = useState("")
  const [liquidityFee3Error, setLiquidityFee3Error] = useState("")
  const [buyBackFee3Error, setBuyBackFee3Error] = useState("")
  const [reflectionFee3Error, setReflectionFee3Error] = useState("")
  const [charityFee3Error, setCharityFee3Error] = useState("")

  const [totalFee3Error, setTotalFee3Error] = useState("")



  useEffect(() => {
    setNameError("")
    setSymbolError("")
    setDecimalsError("")
    setTotalSupplyError("")

    if (name.length < 2) setNameError("tokenName must be at least 2 characters")
    if (name === "") setNameError("tokenName cannot be blank")

    if (symbol.length < 2) setSymbolError("tokenSymbol must be at least 2 characters")
    if (symbol === "") setSymbolError("tokenSymbol cannot be blank")

    if (Number(decimals) < 2 && type === "standard") setDecimalsError("tokenDecimals must be greater than or equal to 2")
    if (decimals === "" && type === "standard") setDecimalsError("tokenDecimals cannot be blank")

    if (totalSupply === "") setTotalSupplyError("totalSupply cannot be blank")
  }, [name, symbol, decimals, totalSupply, type])

  useEffect(() => {
    setTaxFee1Error("")
    setLiquidityFee1Error("")
    setCharityAddr1Error("")
    setCharityFee1Error("")
    setTotalFee1Error("")

    if (type === "liquidityGen") {
      if (Number(taxFee1) > 25) setTaxFee1Error("taxFeeBps must be less than or equal to 25")
      if (Number(taxFee1) < 0.01) setTaxFee1Error("taxFeeBps must be greater than or equal to 0.01")
      if (taxFee1 === "") setTaxFee1Error("taxFeeBps is a required field")

      if (Number(liquidityFee1) > 25) setLiquidityFee1Error("liquidityFeeBps must be less than or equal to 25")
      if (Number(liquidityFee1) < 0.01) setLiquidityFee1Error("liquidityFeeBps must be greater than or equal to 0.01")
      if (liquidityFee1 === "") setLiquidityFee1Error("liquidityFeeBps is a required field")

      if (!isAddress(charityAddr1)) setCharityAddr1Error("Address is invalid")
      if (charityAddr1 === "") setCharityAddr1Error("Address cannot be blank")

      if (Number(charityFee1) > 25) setCharityFee1Error("charityBps must be less than or equal to 25")
      if (Number(charityFee1) < 0.01) setCharityFee1Error("charityBps must be greater than or equal to 0.01")
      if (charityFee1 === "") setCharityFee1Error("charityBps is a required field")

      if (Number(taxFee1) + Number(liquidityFee1) + Number(charityFee1) > 25) setTotalFee1Error("Total Fee must be less than or equal to 25")
    }
  }, [taxFee1, liquidityFee1, charityAddr1, charityFee1, type])

  useEffect(() => {
    setMinBalance2Error("")
    setRewardFee2Error("")
    setLiquidity2Error("")
    setCharityFee2Error("")
    setCharityAddr2Error("")
    setTotalFee2Error("")

    if (type === "baby") {
      if (Number(minBalance2) > Number(totalSupply) / 1000) setMinBalance2Error("Minimum token balance for dividends must be less than or equal 0.1% total supply")
      if (Number(minBalance2) < 0.01) setMinBalance2Error("minimumTokenBalanceForDividends must be greater than or equal to 1")
      if (minBalance2 === "") setMinBalance2Error("Minimum token balance for dividends is a required field")

      if (Number(rewardFee2) > 100) setRewardFee2Error("Token reward must be less than or equal to 100")
      if (Number(rewardFee2) < 0.01) setRewardFee2Error("Token reward must be greater than or equal to 0.01")
      if (rewardFee2 === "") setRewardFee2Error("Token reward fee is a required field")

      if (Number(liquidity2) > 100) setLiquidity2Error("liquidityFee must be less than or equal to 100")
      if (Number(liquidity2) < 0.01) setLiquidity2Error("liquidityFee must be greater than or equal to 0.01")
      if (liquidity2 === "") setLiquidity2Error("Auto add liquidity is a required field")

      if (Number(charityFee2) > 100) setCharityFee2Error("marketingFee must be less than or equal to 100")
      if (Number(charityFee2) < 0.01) setCharityFee2Error("marketingFee must be greater than or equal to 0.01")
      if (charityFee2 === "") setCharityFee2Error("Marketing fee is a required field")

      if (!isAddress(charityAddr2)) setCharityAddr2Error("Address is invalid")
      if (charityAddr2 === "") setCharityAddr2Error("Address cannot be blank")

      if (Number(liquidity2) + Number(charityFee2) + Number(rewardFee2) > 25) setTotalFee2Error("Liquidity Fee + Marketing Fee + Reward Fee must be less than or equal to 25")
    }
  }, [minBalance2, rewardFee2, liquidity2, charityAddr2, charityFee2, totalSupply, type])

  useEffect(() => {
    setLiquidityFee3Error("")
    setBuyBackFee3Error("")
    setReflectionFee3Error("")
    setCharityFee3Error("")
    setTotalFee3Error("")

    if (type === "buyBackBaby") {
      if (Number(liquidityFee3) > 100) setLiquidityFee3Error("liquidityFee must be less than or equal to 100")
      if (Number(liquidityFee3) < 0.01) setLiquidityFee3Error("liquidityFee must be greater than or equal to 0.01")
      if (liquidityFee3 === "") setLiquidityFee3Error("liquidityFee is a required field")

      if (Number(buyBackFee3) > 100) setBuyBackFee3Error("buybackFee must be less than or equal to 100")
      if (Number(buyBackFee3) < 0.01) setBuyBackFee3Error("buybackFee must be greater than or equal to 0.01")
      if (buyBackFee3 === "") setBuyBackFee3Error("buybackFee is a required field")

      if (Number(reflectionFee3) > 100) setReflectionFee3Error("reflectionFee must be less than or equal to 100")
      if (Number(reflectionFee3) < 0.01) setReflectionFee3Error("reflectionFee must be greater than or equal to 0.01")
      if (reflectionFee3 === "") setReflectionFee3Error("reflectionFee is a required field")

      if (Number(charityFee3) > 100) setCharityFee3Error("marketingFee must be less than or equal to 100")
      if (Number(charityFee3) < 0.01) setCharityFee3Error("marketingFee must be greater than or equal to 0.01")
      if (charityFee3 === "") setCharityFee3Error("marketingFee is a required field")

      if (Number(buyBackFee3) + Number(charityFee3) + Number(reflectionFee3) + Number(liquidityFee3) > 25) setTotalFee3Error("Liquidity Fee + Buyback Fee + Reflection Fee + Marketing Fee must be less than 25%")
    }
  }, [liquidityFee3, buyBackFee3, reflectionFee3, charityFee3, type])

  useEffect(() => {
    setCurrency(WNATIVE[chainId])
  }, [chainId])

  // const handleNext = async () => {
  //   setTokenData({
  //     tokenAddress: searchToken.address,
  //     tokenName: searchToken.name,
  //     tokenDecimals: searchToken.decimals,
  //     tokenSymbol: searchToken.symbol,
  //     currency,
  //     mainFee,
  //     tokenFee,
  //     listingOption
  //   })
  //   setModalView(LaunchpadFormView.DeFiInfo)
  // }

  const deployContract = async (contract, args, msg) => {
    return contract.deploy(...args, msg)
  }

  const handleDeploy = useCallback(
    async(contract, args, msg) => {
      return deployContract(contract, args, msg)
    },
    []
  )

  const handleConfirm = async () => {
    setTokenData({
      name,
      symbol,
      decimals,
      totalSupply,
      type,
      liquidityGen: {
        taxFee1,
        liquidityFee1,
        charityAddr1,
        charityFee1,
      },
      baby: {
        rewardToken2: currency,
        minBalance2,
        rewardFee2,
        liquidity2,
        charityAddr2,
        charityFee2,
      },
      buyBackBaby: {
        rewardToken3: currency,
        liquidityFee3,
        buyBackFee3,
        reflectionFee3,
        charityFee3,
      }
    })

    const factory = new ContractFactory(tokenABI[type], byteCodes[type], signer)

    // console.log(ethers.utils.parseUnits(minBalance2, decimals))

    const args = {
      "standard": [
        name,
        symbol,
        decimals,
        ethers.utils.parseUnits(totalSupply, Number(decimals).toString()),
        feeReceivers[chainId],
        ethers.utils.parseEther(fee[chainId])
      ],
      "liquidityGen": [
        name,
        symbol,
        ethers.utils.parseUnits(totalSupply, 18),
        ROUTER_ADDRESS[chainId],
        charityAddr1,
        new BigNumber(taxFee1).times(100).toJSON(),
        new BigNumber(liquidityFee1).times(100).toJSON(),
        new BigNumber(charityFee1).times(100).toJSON(),
        feeReceivers[chainId],
        ethers.utils.parseEther(fee[chainId]),
      ],
      "baby": [
        name,
        symbol,
        ethers.utils.parseUnits(totalSupply, 18),
        [
          currency.address,
          ROUTER_ADDRESS[chainId],
          charityAddr2,
          dividendTrackerAddresses[chainId]
        ],
        [
          rewardFee2,
          liquidity2,
          charityFee2
        ],
        ethers.utils.parseUnits(Number(minBalance2).toString(), 18),
        feeReceivers[chainId],
        ethers.utils.parseEther(fee[chainId]),
      ],
      "buyBackBaby": [
        name,
        symbol,
        ethers.utils.parseUnits(totalSupply, 18),
        currency.address,
        ROUTER_ADDRESS[chainId],
        [
          liquidityFee3, 
          buyBackFee3, 
          reflectionFee3, 
          charityFee3,
          "100"
        ],
        feeReceivers[chainId],
        ethers.utils.parseEther(fee[chainId]),
      ],
    }

    const receipt = await fetchWithCatchTxErrorForDeploy(() => handleDeploy(factory, args[type], {value: ethers.utils.parseEther(fee[chainId])}))
    if (receipt) {
      toastSuccess(
        `${t('Token Created')}!`,
        <ToastDescriptionWithTx txHash={receipt.deployTransaction.hash}>
          {t('You\'ve just created %name%', { name })}
        </ToastDescriptionWithTx>,
      )
      setFinishData({
        address: receipt.address,
        hash: receipt.deployTransaction.hash,
        chainId
      })
      setModalView(TokenFormView.Finish)
    }
  }

  const enabled = 
    nameError === "" &&
    symbolError === "" &&
    (
      type === "standard" ? decimalsError === "" : true
    ) &&
    totalSupplyError === "" &&
    (
      type === "liquidityGen" ? (
        taxFee1Error === "" &&
        liquidityFee1Error === "" &&
        charityFee1Error === "" &&
        charityAddr1Error === ""
      ) : true
    ) &&
    (
      type === "baby" ? (
        minBalance2Error === "" &&
        rewardFee2Error === "" &&
        liquidity2Error === "" &&
        charityAddr2Error === "" &&
        charityFee2Error === "" &&
        totalFee2Error === ""
      ) : true
    ) &&
    (
      type === "buyBackBaby" ? (
        buyBackFee3Error === "" &&
        liquidityFee3Error === "" &&
        reflectionFee3Error === "" &&
        charityFee3Error === "" &&
        totalFee3Error === ""
      ) : true
    )

  const handleCurrencySelect = useCallback(
    (_currency: Currency) => {
      setCurrency(_currency.wrapped)
    },
    [],
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleCurrencySelect}
      showCommonBases
      selectedCurrency={currency.wrapped ?? undefined}
      commonBasesType={CommonBasesType.LIQUIDITY}
    />,
    true,
    true,
    'selectCurrencyModal',
  )

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Create Token')} subTitle={t('Enter the token information')} />
      <FormContainer>
        <Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Token Type")}</Text>
            <Flex
              alignItems="center"
              onClick={
                () => {
                  setType("standard")
                }
              }
            >
              <Checkbox
                scale="sm"
                checked={type === "standard"}
                value="standard"
                readOnly
              />
              <Text ml="20px">{t("Standard Token")}</Text>
            </Flex>
            <Flex 
              alignItems="center" 
              onClick={
                () => {
                  setType("liquidityGen")
                }
              }
            >
              <Checkbox
                scale="sm"
                checked={type === "liquidityGen"}
                value="liquidityGen"
                readOnly
              />
              <Text ml="20px">{t("Liquidity Generator Token")}</Text>
            </Flex>
            <Flex 
              alignItems="center" 
              onClick={
                () => {
                  setType("baby")
                }
              }
            >
              <Checkbox
                scale="sm"
                checked={type === "baby"}
                value="baby"
                readOnly
              />
              <Text ml="20px">{t("Baby Token")}</Text>
            </Flex>
            <Flex 
              alignItems="center" 
              onClick={
                () => {
                  setType("buyBackBaby")
                }
              }
            >
              <Checkbox
                scale="sm"
                checked={type === "buyBackBaby"}
                value="buyBackBaby"
                readOnly
              />
              <Text ml="20px">{t("BuyBack Baby Token")}</Text>
            </Flex>
          </Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Name*")}</Text>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {nameError}
            </Text>}
          </Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Symbol*")}</Text>
            <Input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            {symbolError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {symbolError}
            </Text>}
          </Box>
          {type === "standard" && <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Decimals*")}</Text>
            <Input
              type="number"
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
            />
            {decimalsError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {decimalsError}
            </Text>}
          </Box>}
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Total Supply*")}</Text>
            <Input
              type="number"
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
            />
            {totalSupplyError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {totalSupplyError}
            </Text>}
          </Box>
          {(type === "baby" || type === "buyBackBaby") && <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Reward token")}</Text>
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
          </Box>}
          {type === "liquidityGen" && <>
            <Box mb="20px">
              <Flex flexDirection={["column", "column", "column", "row"]}>
                <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
                  <Text fontSize="12px" color="primary">{t("Transaction fee to generate yield (%)*")}</Text>
                  <Input
                    type="number"
                    value={taxFee1}
                    onChange={(e) => setTaxFee1(e.target.value)}
                  />
                  {taxFee1Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {taxFee1Error}
                  </Text>}
                </Box>
                <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
                  <Text fontSize="12px" color="primary">{t("Transaction fee to generate liquidity (%)*")}</Text>
                  <Input
                    type="number"
                    value={liquidityFee1}
                    onChange={(e) => setLiquidityFee1(e.target.value)}
                  />
                  {liquidityFee1Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {liquidityFee1Error}
                  </Text>}
                </Box>
              </Flex>
            </Box>
            <Box mb="20px">
              <Text fontSize="12px" color="primary">{t("Charity/Marketing address")}</Text>
              <Input
                type="string"
                value={charityAddr1}
                onChange={(e) => setCharityAddr1(e.target.value)}
              />
              {charityAddr1Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                {charityAddr1Error}
              </Text>}
            </Box>
            <Box mb="20px">
              <Text fontSize="12px" color="primary">{t("Charity/Marketing percent (%)")}</Text>
              <Input
                type="number"
                value={charityFee1}
                onChange={(e) => setCharityFee1(e.target.value)}
              />
              {charityFee1Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                {charityFee1Error}
              </Text>}
            </Box>
            <Box mb="20px">
              {totalFee1Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                {totalFee1Error}
              </Text>}
            </Box>
          </>}
          {type === "baby" && <>
            <Box mb="20px">
              <Flex flexDirection={["column", "column", "column", "row"]}>
                <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
                  <Text fontSize="12px" color="primary">{t("Minimum token balance for dividends%symbol%*", {symbol: totalSupply ? ` (max: ${Number(totalSupply)/1000})` : ""})}</Text>
                  <Input
                    type="number"
                    value={minBalance2}
                    onChange={(e) => setMinBalance2(e.target.value)}
                  />
                  {minBalance2Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {minBalance2Error}
                  </Text>}
                  <Text color="text" fontSize="14px">{t("Min hold each wallet must be over $50 to receive rewards.")}</Text>
                </Box>
                <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
                  <Text fontSize="12px" color="primary">{t("Token reward fee (%)*")}</Text>
                  <Input
                    type="number"
                    value={rewardFee2}
                    onChange={(e) => setRewardFee2(e.target.value)}
                  />
                  {rewardFee2Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {rewardFee2Error}
                  </Text>}
                </Box>
              </Flex>
            </Box>
            <Box mb="20px">
              <Flex flexDirection={["column", "column", "column", "row"]}>
                <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
                  <Text fontSize="12px" color="primary">{t("Auto add liquidity (%)*")}</Text>
                  <Input
                    type="number"
                    value={liquidity2}
                    onChange={(e) => setLiquidity2(e.target.value)}
                  />
                  {liquidity2Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {liquidity2Error}
                  </Text>}
                </Box>
                <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
                  <Text fontSize="12px" color="primary">{t("Marketing fee (%)*")}</Text>
                  <Input
                    type="number"
                    value={charityFee2}
                    onChange={(e) => setCharityFee2(e.target.value)}
                  />
                  {charityFee2Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {charityFee2Error}
                  </Text>}
                </Box>
              </Flex>
            </Box>
            <Box mb="20px">
              <Text fontSize="12px" color="primary">{t("Marketing wallet*")}</Text>
              <Input
                type="string"
                value={charityAddr2}
                onChange={(e) => setCharityAddr2(e.target.value)}
              />
              {charityAddr2Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                {charityAddr2Error}
              </Text>}
            </Box>
            <Box mb="20px">
              {totalFee2Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                {totalFee2Error}
              </Text>}
            </Box>
          </>}
          {type === "buyBackBaby" && <>
            <Box mb="20px">
              <Flex flexDirection={["column", "column", "column", "row"]}>
                <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
                  <Text fontSize="12px" color="primary">{t("Liquidity Fee (%)*")}</Text>
                  <Input
                    type="number"
                    value={liquidityFee3}
                    onChange={(e) => setLiquidityFee3(e.target.value)}
                  />
                  {liquidityFee3Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {liquidityFee3Error}
                  </Text>}
                </Box>
                <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
                  <Text fontSize="12px" color="primary">{t("Buyback Fee (%)*")}</Text>
                  <Input
                    type="number"
                    value={buyBackFee3}
                    onChange={(e) => setBuyBackFee3(e.target.value)}
                  />
                  {buyBackFee3Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {buyBackFee3Error}
                  </Text>}
                </Box>
              </Flex>
            </Box>
            <Box mb="20px">
              <Flex flexDirection={["column", "column", "column", "row"]}>
                <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
                  <Text fontSize="12px" color="primary">{t("Reflection Fee (%)*")}</Text>
                  <Input
                    type="number"
                    value={reflectionFee3}
                    onChange={(e) => setReflectionFee3(e.target.value)}
                  />
                  {reflectionFee3Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {reflectionFee3Error}
                  </Text>}
                </Box>
                <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
                  <Text fontSize="12px" color="primary">{t("Marketing fee (%)*")}</Text>
                  <Input
                    type="number"
                    value={charityFee3}
                    onChange={(e) => setCharityFee3(e.target.value)}
                  />
                  {charityFee3Error !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {charityFee3Error}
                  </Text>}
                </Box>
              </Flex>
            </Box>
          </>}
        </Box>
        <Text color="warning" fontSize="14px" px="4px">
          {t(`Token creation fee is ${fee[chainId]} ${native.symbol}.`)}
        </Text>
        {!account ? <ConnectWalletButton /> : (
          <Button
            onClick={handleConfirm}
            disabled={!enabled || pendingTx}
          >
            {
              pendingTx ? 
                <AutoRow gap="6px" justify="center">
                  {t('Creating')} <CircleLoader stroke="white" />
                </AutoRow> 
              : 
                t('Create Token')
              }
          </Button>
        )}
      </FormContainer>
    </Box>
  )
}
