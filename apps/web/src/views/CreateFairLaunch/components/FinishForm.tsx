import { Dispatch, SetStateAction } from 'react'
// import { isAddress } from '@ethersproject/address'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { Text, Box, Button, Flex, Link, NextLinkFromReactRouter, TokenLogo } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import styled from 'styled-components'
// import { useAccount, useChainId } from 'wagmi'
// import ConnectWalletButton from 'components/ConnectWalletButton'
// import { BAD_SRCS } from 'components/Logo/constants'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { ProgressCirclesFullCompleted } from 'views/CreateLaunchpad/components/ProgressSteps'
import { DeFi, FinishData, LaunchpadFormView, Socials, TokenData } from '../types'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'
import useCountdown from '../hooks/useCountdown'

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

const CircleBox = styled(Box)<{variant: string}>`
  background: ${({ theme, variant }) => theme.colors.bronze};
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin-right: 10px;
  margin-top: 3px;
`

const Badge = styled(Flex)<{variant: string}>`
  background: ${({ theme, variant }) => theme.colors.secondary80};
  // opacity: 0.5;
  padding: 0 10px 3px 10px;
  margin: auto;
  border-radius: 16px;
  align-items: center;
`

const StyledBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: none;
  border-radius: 8px;
  min-width: 360px;
  max-width: 450px;
  // height: 400px;
  padding: 20px;
`

const ImageBox = styled(Box)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 28px;
  width: 56px;
  height: 56px;
  // margin-bottom: 16px;
`

const ProgressBar = styled(Box)`
  margin-top: 6px;
  border-radius: 8px;
  border: 4px solid ${({ theme }) => theme.colors.backgroundAlt};
`

const padTime = (num: number) => num.toString().padStart(2, '0')

const formatRoundTime = (secondsBetweenBlocks: number) => {
  const { days, hours, minutes, seconds } = getTimePeriods(secondsBetweenBlocks)
  const minutesSeconds = `${padTime(days)}:${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`

  return minutesSeconds
}

export function FinishForm({
  setModalView,
  tokenData,
  deFiData,
  socials,
  setTokenData,
  setDefiData,
  setSocials,
  setPresale,
  address,
}: {
  setModalView: Dispatch<SetStateAction<LaunchpadFormView>>
  tokenData: TokenData
  deFiData: DeFi
  socials: Socials
  setTokenData: Dispatch<SetStateAction<TokenData>>
  setDefiData: Dispatch<SetStateAction<DeFi>>
  setSocials: Dispatch<SetStateAction<Socials>>
  setPresale: Dispatch<SetStateAction<FinishData>>
  address: string
}) {
  const { t } = useTranslation()
  // const chainId = useChainId()
  // const { address: account } = useAccount()
  const native = useNativeCurrency()

  const { secondsRemaining } = useCountdown(Math.floor(Date.parse(deFiData.startTime) / 1000))
  // const { secondsRemaining } = useCountdown(Math.floor(Date.now() / 1000 - 5))
  const countdown = formatRoundTime(secondsRemaining)

  const handleReturn = async () => {
    setTokenData({
      tokenAddress: "",
      tokenName: "",
      tokenDecimals: 0,
      tokenSymbol: "",
      currency: native,
      mainFee: "50",
      tokenFee: "0",
    })

    setDefiData({
      total: "",
      whitelist: false,
      softCap: "",
      isMax: false,
      maximumBuy: "",
      liquidity: "",
      startTime: "",
      endTime: "",
      lockTime: "",
      totalAmount: "0",
      isVesting: false,
      vestingData: {
        vestingFirst: "0",
        vestingPeriod: "0",
        vestingEach: "0"
      }
    })

    setSocials({
      website: "",
      logoUrl: "",
      facebook: "",
      twitter: "",
      github: "",
      telegram: "",
      instagram: "",
      discord: "",
      reddit: "",
      youtube: "",
      whitelist: "",
      description: "",
    })

    setPresale({address: ""})

    setModalView(LaunchpadFormView.VerifyToken)
  }

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Create Launchpad')} subTitle={t('')} />
      <FormContainer>
        <ProgressCirclesFullCompleted steps={[true, true, true]} />
        <Box>
          <Text fontSize="16px" bold color="primary">{t("Congratulation!")}</Text>
          <Text fontSize="12px">{t("You've just created launchpad")}</Text>
        </Box>
        {/* <Flex width="100%" justifyContent="center" mb={["0", "50px"]}>
          <StyledBox>
            <Flex justifyContent="space-between" mb="20px">
              <ImageBox>
                <StyledLogo badSrcs={BAD_SRCS} size="56px" srcs={[socials.logoUrl]} alt={`${tokenData.tokenSymbol} logo`} />
              </ImageBox>
              <Flex flexDirection="column" alignItems="center" mr="20px">
                <Badge variant="upcoming">
                  <CircleBox variant="upcoming" />
                  <Text color="bronze">{t("Upcoming")}</Text>
                </Badge>
              </Flex>
            </Flex>
            <Box mb="1rem">
              <Text color="primary" bold fontSize="24px">{tokenData.tokenName}</Text>
              <Text bold>{t("Fair Launch%symbol%", {symbol: deFiData.isMax ? ` Max Buy ${deFiData.maximumBuy} ${tokenData.currency.symbol}` : ""})}</Text>
            </Box>
            <Box mb="0.5rem">
              <Text color="primary" bold fontSize="16px">{t("Soft")}</Text>
              <Text color="failure" bold>{t("%amount% %symbol%", {symbol: tokenData.currency.symbol, amount: Number(deFiData.softCap).toLocaleString()})}</Text>
            </Box>
            <Box mb="0.5rem">
              <Text color="primary" bold fontSize="16px">{t("Progress (0.00%)")}</Text>
              <ProgressBar />
              <Flex justifyContent="space-between">
                <Text color="textDisabled" fontSize="14px" bold>{t("0 %symbol%", {symbol: tokenData.currency.symbol})}</Text>
                <Text color="textDisabled" fontSize="14px" bold>{t("%amount% %symbol%", {symbol: tokenData.currency.symbol, amount: Number(deFiData.softCap).toLocaleString()})}</Text>
              </Flex>
            </Box>
            <Flex justifyContent="space-between">
              <Text color="primary" bold fontSize="16px">{t("Liquidity (%)")}</Text>
              <Text bold fontSize="16px">{t("%amount%%", {amount: deFiData.liquidity})}</Text>
            </Flex>
            <Flex mb="0.5rem" justifyContent="space-between">
              <Text color="primary" bold fontSize="16px">{t("Lockup Time")}</Text>
              <Text bold fontSize="16px">{t("%amount% days", {amount: deFiData.lockTime})}</Text>
            </Flex>
            <Flex mb="0.5rem" justifyContent="space-between">
              <Box>
                <Text color="primary" bold fontSize="14px">{t("Sale starts in:")}</Text>
                <Text bold fontSize="12px">{countdown}</Text>
              </Box>
              <Flex>
                {socials.whitelist !== "" && <Link external href={socials.whitelist}>
                  <Button
                    width="100%"
                    mr="10px"
                  >{t("WL")}</Button>
                </Link>}
                <NextLinkFromReactRouter to={`/launchpad/${address}`}>
                  <Button
                    width="100%"
                    variant="secondary"
                  >{t("View")}</Button>
                </NextLinkFromReactRouter>
              </Flex>
            </Flex>
          </StyledBox>
        </Flex> */}
        <Flex width="100%" alignItems="center" flexDirection={["column", "row"]}>
          {/* {socials.whitelist !== "" && <Link external href={socials.whitelist} width="100% !important">
            <Button
              width="100%"
              mr="10px"
              variant="secondary"
            >{t("WL")}</Button>
          </Link>} */}
          <Box width="100%">
            <NextLinkFromReactRouter to={`/launchpad/${address}`}>
              <Button
                width="100%"
                variant="secondary"
              >{t("View FairLaunch")}</Button>
            </NextLinkFromReactRouter>
          </Box>
        </Flex>
        <Flex width="100%" alignItems="center" flexDirection={["column", "row"]}>
          <Box mr={["0", "15px"]} mb={["10px", "0"]} width="100%">
            <Button
              width="100%"
              onClick={handleReturn}
            ><Text color="invertedContrast" bold fontSize="14px">{t("Create Other")}</Text></Button>
          </Box>
          <Box width="100%">
            <NextLinkFromReactRouter to="/launchpads">
              <Button
                width="100%"
              ><Text color="invertedContrast" bold fontSize="14px">{t("Go to List")}</Text></Button>
            </NextLinkFromReactRouter>
          </Box>
        </Flex>
      </FormContainer>
    </Box>
  )
}
