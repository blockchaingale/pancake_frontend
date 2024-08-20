import { useTranslation } from '@pancakeswap/localization'
import { useDebounce } from '@pancakeswap/hooks'
import { Text, Box, Card, Button, Flex, Link, NextLinkFromReactRouter, TokenLogo } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import styled, { useTheme } from 'styled-components'
import { useAccount, useChainId } from 'wagmi'
import { BAD_SRCS } from 'components/Logo/constants'
import Divider from 'components/Divider'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { ZERO_ADDRESS } from 'config/constants'
import { CHAIN_QUERY_NAME } from 'config/chains'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useToken } from 'hooks/Tokens'
import { SerializedLaunchpadData } from 'state/launchpads/types'
import useCountdown from '../hooks/useCountdown'

const StyledCard = styled(Card)`
  border-radius: 8px;
  width: 100%;
  z-index: 1;
  padding: 1px;
  min-width: 360px;
  // max-width: 450px;
`

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

const StyledChainLogo = styled(Box)`
  position: absolute;
  background-color: ${({theme}) => theme.colors.invertedContrast}
  padding: 8px;
  border-radius: 8px;
  top: 36px;
  right: -8px;
`

const CircleBox = styled(Box)<{variant: string}>`
  background: ${({ theme, variant }) => theme.colors.bronze};
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin-right: 10px;
  margin-top: 3px;
`

// const Badge = styled(Flex)<{variant: string}>`
//   background: ${({ theme, variant }) => theme.colors.secondary80};
//   // opacity: 0.5;
//   padding: 0 10px 3px 10px;
//   margin: auto;
//   border-radius: 16px;
//   align-items: center;
// `

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

const ProgressBase = styled(Box)<{cap: number, pos: number}>`
  margin-top: 2px;
  border-radius: 8px;
  height: 16px;
  background: ${({ theme, cap, pos }) => cap >= pos ? theme.colors.text33 : theme.colors.primary66};
  // border: 8px solid ${({ theme, cap, pos }) => cap >= pos ? theme.colors.text33 : theme.colors.primary66};
`

const ProgressBar = styled(Box)<{cap: number, pos: number}>`
  margin-top: 2px;
  border-radius: 8px;
  width: ${({ cap, pos }) => cap >= pos ? pos / cap * 100 : cap / pos * 100}%;
  border: 8px solid ${({ theme }) => theme.colors.primary};
`

const Badge = styled(Box)<{ status: string}>`
  background: ${({theme, status}) => status === "upcoming" ? theme.colors.warning33 : status === "live" || status === "success" ? theme.colors.success19 : theme.colors.text33};
  color: ${({theme, status}) => status === "upcoming" ? theme.colors.primary : status === "live" || status === "success" ? theme.colors.success : theme.colors.text};
  font-size: 14px;
  border-radius: 8px;
  padding: 3px 15px;
  height: 20px;
`

const padTime = (num: number) => num.toString().padStart(2, '0')

const formatRoundTime = (secondsBetweenBlocks: number) => {
  const { days, hours, minutes, seconds } = getTimePeriods(secondsBetweenBlocks)
  const minutesSeconds = `${padTime(days)}:${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`

  return minutesSeconds
}

const getStatus = (startTime: number, endTime: number, refundable: boolean, claimable: boolean) => {
  const now = Date.now() / 1000
  if (refundable)
    return ["canceled", "CANCELED", "Presale", "Canceled"]
  if (claimable)
    return ["success", "SUCCESS", "Presale", "Ended"]
  if (startTime > now)
    return ["upcoming", "UPCOMING", "Sale Starts In:", ""]
  if (startTime < now && endTime > now)
    return ["live", "SALE LIVE", "Sale Ends In:", ""]
  if (endTime < now)
    return ["ended", "ENDED", "Presale", "Ended"]
  return ["", "", "", ""]
}

export function LaunchpadCard({
  data
}: {
  data: SerializedLaunchpadData
}) {
  const { t } = useTranslation()
  const native = useNativeCurrency()

  // const debouncedQuery1 = useDebounce(data.token, 200)
  const debouncedQuery = useDebounce(data.buyToken, 200)
  // const searchToken = useToken(debouncedQuery1)
  const _searchBuyToken = useToken(debouncedQuery)
  const searchBuyToken = data.buyToken === ZERO_ADDRESS ? native : _searchBuyToken

  // const buyTokenSymbol = data.buyToken === ZERO_ADDRESS ? native.symbol : data.buyTokenSymbol
  // const buyTokenDecimals = data.buyToken === ZERO_ADDRESS ? native.decimals : data.buyTokenDecimals

  const [status, statusText, banText, countText] = getStatus(data.startTime, data?.endTime, data?.refundable, data?.claimable)

  const { secondsRemaining } = useCountdown(Math.floor(status === "upcoming" ? data.startTime : data.endTime))
  const countdown = formatRoundTime(secondsRemaining)

  return (
		<StyledCard>
      <Box p="20px">
        <Flex justifyContent="space-between" mb="14px">
          <Box position="relative">
            <StyledLogo badSrcs={BAD_SRCS} size="56px" srcs={[data.logoUrl]} alt={data.token} />
            <StyledChainLogo>
              <ChainLogo chainId={data.chainId} />
            </StyledChainLogo>
          </Box>
          <Flex flexDirection="column" alignItems="center" mr="20px">
            <Badge status={status}>
              {t(statusText)}
            </Badge>
          </Flex>
        </Flex>
        {data.presaleType === "standard" && searchBuyToken && <Box mb="1rem">
          <Text bold fontSize="26px">{data.tokenName}</Text>
          <Text>1 {searchBuyToken.symbol} = {(data.rate / (10 ** data.tokenDecimals)).toLocaleString()} {data.tokenSymbol}</Text>
        </Box>}
        {data.presaleType === "fair" && searchBuyToken && <Box mb="1rem">
          <Text bold fontSize="26px">{data.tokenName}</Text>
          <Text>{t("Fair Launch -%symbol%", {symbol: data.maxBuy !== 0 ? ` Max Buy ${data.maxBuy} ${searchBuyToken.symbol}` : ""})}</Text>
        </Box>}
        {data.presaleType === "standard" && searchBuyToken && <Box mb="0.5rem">
          <Text color="primary" bold fontSize="12px">{t("Soft/Hard")}</Text>
          <Text color="failure" bold fontSize="20px">{t("%amount1% %symbol% - %amount2% %symbol%", {symbol: searchBuyToken.symbol, amount1: (data.softCap / (10**searchBuyToken.decimals)).toLocaleString(), amount2: (data.hardCap / (10**searchBuyToken.decimals)).toLocaleString()})}</Text>
        </Box>}
        {data.presaleType === "fair" && searchBuyToken && <Box mb="0.5rem">
          <Text color="primary" bold fontSize="12px">{t("Soft")}</Text>
          <Text color="failure" bold fontSize="20px">{t("%amount% %symbol%", {symbol: searchBuyToken.symbol, amount: (data.softCap / (10**searchBuyToken.decimals)).toLocaleString()})}</Text>
        </Box>}
        {searchBuyToken && <Box mb="0.5rem">
          <Text color="primary" bold fontSize="12px">{t("Progress")} {`(${(data.amount / (data.presaleType === "standard" ? data.hardCap : data.softCap) * 100).toLocaleString()}%)`}</Text>
          <ProgressBase cap={data.presaleType === "standard" ? data.hardCap : data.softCap} pos={data.amount}>
            <ProgressBar cap={data.presaleType === "standard" ? data.hardCap : data.softCap} pos={data.amount} />
          </ProgressBase>
          <Flex justifyContent="space-between">
            <Text color="textDisabled" fontSize="16px" bold>{t("%amount% %symbol%", {symbol: searchBuyToken.symbol, amount: (data.amount / 10**searchBuyToken.decimals).toLocaleString()})}</Text>
            <Text color="textDisabled" fontSize="16px" bold>{t("%amount% %symbol%", {symbol: searchBuyToken.symbol, amount: data.presaleType === "standard" ? (data.hardCap / 10**searchBuyToken.decimals).toLocaleString() : (data.softCap / 10**searchBuyToken.decimals).toLocaleString()})}</Text>
          </Flex>
        </Box>}
        <Flex justifyContent="space-between">
          <Text color="primary" bold fontSize="16px">{t("Liquidity (%)")}</Text>
          <Text bold fontSize="16px">{t("%amount%", {amount: data.liquidity !== 0 ? data.liquidity / 10 : "Manual listing"})}</Text>
        </Flex>
        <Flex mb="0.5rem" justifyContent="space-between">
          <Text color="primary" bold fontSize="16px">{t("Lockup Time")}</Text>
          <Text bold fontSize="16px">{t("%amount%", {amount: data.liquidity !== 0 ? `${data.lockTime / 24 / 3600} days`  : "Unlocked"})}</Text>
        </Flex>
        <Divider />
        <Flex mt="20px" mb="0.5rem" justifyContent="space-between">
          <Box>
            <Text color="primary" bold fontSize="14px">{t(banText)}</Text>
            <Text bold fontSize="12px">{t(status === "upcoming" || status === "live" ? countdown : countText)}</Text>
          </Box>
          <Flex>
            {data.whitelist !== "" && <Link external href={data.whitelist}>
              <Button
                width="100%"
                mr="10px"
              >{t("WL")}</Button>
            </Link>}
            <NextLinkFromReactRouter to={`/launchpad/${data.address}?chain=${CHAIN_QUERY_NAME[data.chainId]}`}>
              <Button
                width="100%"
                variant="secondary"
              >{t("View")}</Button>
            </NextLinkFromReactRouter>
          </Flex>
        </Flex>
      </Box>
		</StyledCard>
  )
}
