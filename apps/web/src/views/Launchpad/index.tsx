import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import { Currency, ERC20Token } from '@pancakeswap/sdk'
import { Flex, Card, Box, TokenLogo, Skeleton, Text, LinkExternal, CopyButton, useModal, Button, KeyIcon, useTooltip, Message, MessageText, Checkbox } from "@pancakeswap/uikit"
import { useTranslation } from '@pancakeswap/localization'
import { useDebounce } from '@pancakeswap/hooks'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { useAccount } from 'wagmi'
import { AppBody } from "components/App"
import { BAD_SRCS } from 'components/Logo/constants'
import Page from 'components/Layout/Page'
import Divider from 'components/Divider'
import { ZERO_ADDRESS } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useToken } from 'hooks/Tokens'
import useTotalSupply from 'hooks/useTotalSupply'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { getBlockExploreLink } from 'utils'
import { useLaunchpad, usePollLaunchpadWithUserData } from 'state/launchpad/hooks'
import useCountdown from 'views/CreateLaunchpad/hooks/useCountdown'
import SocialLinks from './components/Socials'
import YoutubeEmbed from './components/Youtube'
import DepositModal from './components/DepositModal'
import SetPublicSaleModal from './components/SetPublicSaleModal'
import SetWhitelistModal from './components/SetWhitelistModal'
import AddWhitelistModal from './components/AddWhitelistModal'
import RemoveWhitelistModal from './components/RemoveWhitelistModal'
import FinalizeModal from './components/FinalizeModal'
import CancelModal from './components/CancelModal'
import InfoModal from './components/InfoModal'

const StyledAppBody = styled(Card)`
  border-radius: 8px;
  width: 100%;
  z-index: 1;
  padding: 1px;
`

const ImageBox = styled(Box)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 28px;
  width: 56px;
  height: 56px;
  // margin-bottom: 16px;
`

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

const Badge = styled(Box)<{ status: string}>`
  background: ${({theme, status}) => status === "upcoming" ? theme.colors.warning33 : status === "live" || status === "success" ? theme.colors.success19 : theme.colors.text33};
  color: ${({theme, status}) => status === "upcoming" ? theme.colors.primary : status === "live" || status === "success" ? theme.colors.success : theme.colors.text};
  font-size: 14px;
  border-radius: 8px;
  padding: 3px 15px;
  height: 20px;
`

const OwnerBadge = styled(Box)`
  background: ${({theme}) => theme.colors.primary};
  padding: 2px 4px;
  border-radius: 4px;
  height: 20px;
`

const StyledBox = styled(Box)`
  background: ${({theme}) => theme.colors.backgroundAlt2};
  border: 1px solid ${({theme}) => theme.colors.primary};
  border-radius: 4px;
  padding: 4px;
`

const ProgressBase = styled(Box)<{cap: number, pos: number}>`
  margin-top: 20px;
  border-radius: 8px;
  height: 16px;
  background: ${({ theme, cap, pos }) => cap >= pos ? theme.colors.text33 : theme.colors.primary66};
  // border: 8px solid ${({ theme, cap, pos }) => cap >= pos ? theme.colors.text33 : theme.colors.primary66};
`

const ProgressBar = styled(Box)<{cap: number, pos: number}>`
  margin-top: 20px;
  border-radius: 8px;
  width: ${({ cap, pos }) => cap >= pos ? pos / cap * 100 : cap / pos * 100}%;
  border: 8px solid ${({ theme }) => theme.colors.primary};
`

const accountEllipsis = (address: string) => {
  return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : null
}

const padTime = (num: number) => num.toString().padStart(2, '0')

const formatRoundTime = (secondsBetweenBlocks: number) => {
  const { days, hours, minutes, seconds } = getTimePeriods(secondsBetweenBlocks)
  const minutesSeconds = `${padTime(days)}:${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`

  return minutesSeconds
}

const getStatus = (startTime: number, endTime: number, refundable: boolean, claimable: boolean) => {
  const now = Date.now() / 1000
  if (refundable)
    return ["canceled", "CANCELED", "The pool has canceled."]
  if (claimable)
    return ["success", "SUCCESS", "The pool has ended."]
  if (startTime > now)
    return ["upcoming", "UPCOMING", "Presale Starts In"]
  if (startTime < now && endTime > now)
    return ["live", "SALE LIVE", "Presale Ends In"]
  if (endTime < now)
    return ["ended", "ENDED", "The pool has ended."]
  return ["", "", ""]
}

const Launchpad = ({pool} : {pool: string}) => {
  const { data, userDataLoaded } = useLaunchpad(pool)

  const { t } = useTranslation()

  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const native = useNativeCurrency()
  
  usePollLaunchpadWithUserData(pool)

  const debouncedToken = useDebounce(data?.token, 200)
  const debouncedBuyToken = useDebounce(data?.buyToken, 200)
  const searchToken = useToken(debouncedToken)

  let searchBuyToken : Currency
  searchBuyToken = useToken(debouncedBuyToken)

  const tokenSupply = useTotalSupply(searchToken)

  const isDataReady = !!data?.token
  const isTokenSupplyReady = !!tokenSupply
  const isTokenReady = !!searchToken
  const isBuyTokenReady = data?.buyToken === ZERO_ADDRESS || !!searchBuyToken
  searchBuyToken = data?.buyToken === ZERO_ADDRESS ? native : searchBuyToken

  const [status, statusText, banText] = getStatus(data?.presaleStartTimestamp, data?.presaleEndTimestamp, data?.refundable, data?.claimable)

  const { secondsRemaining } = useCountdown(status === "upcoming" ? data?.presaleStartTimestamp : data?.presaleEndTimestamp)
  
  const countdown = formatRoundTime(secondsRemaining).split(":")

  const whitelist = data?.whiteListEnableTime > Date.now()/1000

  const [onPresentDeposit] = useModal(
    <DepositModal
      chainId={chainId}
      account={account}
      pool={pool}
      data={data}
      token={searchToken}
      buyToken={searchBuyToken}
    />,
    true,
    true,
    `launchpad-deposit-modal-${pool}`,
  )

  const [onPresentDisableWhitelist] = useModal(
    <SetPublicSaleModal
      chainId={chainId}
      account={account}
      pool={pool}
    />,
    true,
    true,
    `launchpad-publicsale-modal-${pool}`,
  )

  const [onPresentEnableWhitelist] = useModal(
    <SetWhitelistModal
      chainId={chainId}
      account={account}
      pool={pool}
      endTime={isDataReady? data.presaleEndTimestamp : 0}
    />,
    true,
    true,
    `launchpad-whitelist-modal-${pool}`,
  )

  const [onPresentAddWhitelist] = useModal(
    <AddWhitelistModal
      chainId={chainId}
      pool={pool}
    />,
    true,
    true,
    `launchpad-add-whitelist-modal-${pool}`,
  )

  const [onPresentRemoveWhitelist] = useModal(
    <RemoveWhitelistModal
      chainId={chainId}
      pool={pool}
    />,
    true,
    true,
    `launchpad-remove-whitelist-modal-${pool}`,
  )

  const [onPresentFinalize] = useModal(
    <FinalizeModal
      chainId={chainId}
      pool={pool}
    />,
    true,
    true,
    `launchpad-finalize-modal-${pool}`,
  )

  const [onPresentCancel] = useModal(
    <CancelModal
      chainId={chainId}
      pool={pool}
    />,
    true,
    true,
    `launchpad-cancel-modal-${pool}`,
  )

  const [onPresentUpdateInfo] = useModal(
    <InfoModal
      chainId={chainId}
      pool={pool}
      whitelisted={whitelist}
    />,
    true,
    true,
    `launchpad-update-info-modal-${pool}`,
  )

  const handleShowPublicSaleModal = useCallback(() => {
    if (!whitelist)
      return
    onPresentDisableWhitelist()
  }, [whitelist, onPresentDisableWhitelist])

  const handleShowWhitelistedSaleModal = useCallback(() => {
    if (whitelist)
      return
      onPresentEnableWhitelist()
  }, [whitelist, onPresentEnableWhitelist])

  const [isOwnerTooltipDisplayed, setIsOwnerTooltipDisplayed] = useState(false);

  const { targetRef: ownerBadgeRef, tooltip: ownerTooltip } = useTooltip("You are owner of this pool", {
    placement: "auto",
    manualVisible: true,
    trigger: "hover",
  });

  return (
    <Page>
      <Flex width="100%" flexDirection={["column", "column", "column", "column", "column", "column", "row"]} justifyContent="center">
        <Box
          maxWidth={["100%", "100%", "100%", "100%", "100%", "100%", "100%"]} 
          minWidth={["100%", "100%", "100%", "100%", "100%", "100%", "65%"]} 
          mr={["0", "0", "0", "0", "0", "0", "15px"]}
        >
          <StyledAppBody>
            <Box p="20px">
              <Flex flexDirection={["column", "column", "column","row"]} justifyContent={["center", "center", "center", "space-between"]}>
                <Flex width="100%">
                  {
                    isDataReady ? (
                      <StyledLogo badSrcs={BAD_SRCS} size="56px" srcs={[data?.logoUrl]} alt={data?.token} />
                    ) : (
                      <Skeleton mr="8px" width={56} height={56} variant="circle" />
                    )
                  }
                  {
                    isTokenReady ? (
                      <Box ml="15px">
                        <Flex mb="10px">
                          <Text fontSize="20px" fontWeight="600">
                            {t(`${searchToken.name} ${data?.presaleType === "standard" ? "Launchpad" : "Fair Launch"}`)}
                          </Text>
                          { data?.userData?.owner && <><OwnerBadge 
                            ml="10px" 
                            mt="6px" 
                            ref={ownerBadgeRef} 
                            onMouseEnter={() => setIsOwnerTooltipDisplayed(true)} 
                            onMouseLeave={() => setIsOwnerTooltipDisplayed(false)}
                          >
                            <KeyIcon width="12px" />
                          </OwnerBadge></>}
                          {isOwnerTooltipDisplayed && ownerTooltip}
                        </Flex>
                        <SocialLinks links={[data?.website, data?.facebook, data?.twitter, data?.telegram, data?.discord, data?.instagram, data?.github, data?.reddit]} />
                      </Box>
                    ) : (
                      <Skeleton ml="15px" width="100%" height={56} />
                    )
                  }
                </Flex>
                {isDataReady ? <Flex width="100%" justifyContent="right" mt="10px">
                  <Badge status={status}>{t(statusText)}</Badge>
                </Flex> : (
                  <Skeleton ml="15px" width="100%" height={56} />
                )}
              </Flex>
              <Box mt="15px">
                {
                  isDataReady ? (
                    <Box mb="20px">
                      <Text small>{data?.info}</Text>
                    </Box>
                  ) : (
                    <Skeleton width="100%" height={100} />
                  )
                }
                {
                  isDataReady && data?.youtube !== "" && (
                    <YoutubeEmbed embedId={data?.youtube} />
                  )
                }
                <Box>
                  <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Presale Address")}</Text>
                    <Flex alignItems="center">
                      <LinkExternal href={getBlockExploreLink(pool, 'address', chainId)}>
                        <Text small color="primary">{accountEllipsis(pool)}</Text>
                      </LinkExternal>
                      <CopyButton 
                        width="16px"
                        ml="5px"
                        buttonColor="textSubtle"
                        text={pool}
                        tooltipMessage={t('Presale address copied')}
                      />
                    </Flex>
                  </Flex>
                  <Divider />
                  {isTokenReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Token Name")}</Text>
                    <Text small>{searchToken.name}</Text>
                  </Flex> : (
                    <Skeleton width="100%" height={40} />
                  )}
                  <Divider />
                  {isTokenReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Token Symbol")}</Text>
                    <Text small>{searchToken.symbol}</Text>
                  </Flex> : (
                    <Skeleton width="100%" height={40} />
                  )}
                  <Divider />
                  {isTokenReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Token Decimals")}</Text>
                    <Text small>{searchToken.decimals}</Text>
                  </Flex> : (
                    <Skeleton width="100%" height={40} />
                  )}
                  <Divider />
                  {isTokenReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Token Address")}</Text>
                    <Flex alignItems="center">
                      <LinkExternal href={getBlockExploreLink(searchToken.address, 'token', chainId)}>
                        <Text small color="primary">{accountEllipsis(searchToken.address)}</Text>
                      </LinkExternal>
                      <CopyButton 
                        width="16px"
                        ml="5px"
                        buttonColor="textSubtle"
                        text={searchToken.address}
                        tooltipMessage={t('Token address copied')}
                      />
                    </Flex>
                  </Flex> : (
                    <Skeleton width="100%" height={40} />
                  )}
                  <Divider />
                  {isTokenSupplyReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Total Supply")}</Text>
                    <Text small>{Number(tokenSupply.toExact()).toLocaleString()} {searchToken.symbol}</Text>
                  </Flex> : (
                    <Skeleton width="100%" height={40} />
                  )}
                  <Divider />
                  {isTokenReady && isBuyTokenReady && data?.presaleType === "standard" &&  <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Tokens For Presale")}</Text>
                    <Text small>{(data?.hardCap * data?.rate / (10 ** (searchBuyToken.decimals + searchToken.decimals))).toLocaleString()} {searchToken.symbol}</Text>
                  </Flex>}
                  {isTokenReady && data?.presaleType === "fair" && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Tokens For Presale")}</Text>
                    <Text small>{data?.total / 10**searchToken.decimals} {searchToken.symbol}</Text>
                  </Flex>}
                  <Divider />
                  {isBuyTokenReady && isTokenReady && data.presaleType === "standard" && <>{isBuyTokenReady && isTokenReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Tokens For Liquidity")}</Text>
                    <Text small>{data.liquidity === 0 ? "Manual listing" : `${(((data?.hardCap * (1 - data?.mainFee / 1000)) * data?.liquidity/1000) * data?.listingRate / (10 ** (searchBuyToken.decimals + searchToken.decimals))).toLocaleString()} ${searchToken.symbol}`}</Text>
                  </Flex> : <Skeleton width="100%" height={40} />}
                  <Divider />
                  </>}
                  {isBuyTokenReady && isTokenReady && data.presaleType === "fair" && <>{isBuyTokenReady && isTokenReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Tokens For Liquidity")}</Text>
                    <Text small>{`${(((data?.softCap * (1 - data?.mainFee / 1000)) * data?.liquidity/1000) * data?.listingRate / (10 ** (searchBuyToken.decimals + searchToken.decimals))).toLocaleString()} ${searchToken.symbol}`}</Text>
                  </Flex> : <Skeleton width="100%" height={40} />}
                  <Divider />
                  </>}
                  {isDataReady && isBuyTokenReady && isTokenReady && data.presaleType === "standard" && <>{isTokenReady && isBuyTokenReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Presale Rate")}</Text>
                    <Text small>1 {searchBuyToken.symbol} = {(data?.rate / (10 ** searchToken.decimals)).toLocaleString()} {searchToken.symbol}</Text>
                  </Flex> : (
                    <Skeleton width="100%" height={40} />
                  )}
                  <Divider />
                  {isDataReady && isTokenReady && isBuyTokenReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Listing Rate")}</Text>
                    <Text small>{data.liquidity === 0 ? "Manual listing" : `1 ${searchBuyToken.symbol} = ${(data?.listingRate / (10 ** searchToken.decimals)).toLocaleString()} ${searchToken.symbol}`}</Text>
                  </Flex> : (
                    <Skeleton width="100%" height={40} />
                  )}
                  <Divider />
                  </>}
                  {isBuyTokenReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Soft Cap")}</Text>
                    <Text small>{(data?.softCap / (10**searchBuyToken.decimals)).toLocaleString()} {searchBuyToken.symbol}</Text>
                  </Flex> : (
                    <Skeleton width="100%" height={40} />
                  )}
                  <Divider />
                  {isBuyTokenReady && data.presaleType === "standard" && <>
                    {isBuyTokenReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                      <Text small>{t("Hard Cap")}</Text>
                      <Text small>{(data?.hardCap / (10**searchBuyToken.decimals)).toLocaleString()} {searchBuyToken.symbol}</Text>
                    </Flex> : (
                      <Skeleton width="100%" height={40} />
                    )}
                    <Divider />
                  </>}
                  {isDataReady && data.presaleType === "standard" && <>{isDataReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Refund Address")}</Text>
                    <Flex alignItems="center">
                      <LinkExternal href={getBlockExploreLink(data?.tokenBackAddress, 'address', chainId)}>
                        <Text small color="primary">{accountEllipsis(data?.tokenBackAddress)}</Text>
                      </LinkExternal>
                      <CopyButton 
                        width="16px"
                        ml="5px"
                        buttonColor="textSubtle"
                        text={data.tokenBackAddress}
                        tooltipMessage={t('Refund address copied')}
                      />
                    </Flex>
                  </Flex> : (
                    <Skeleton width="100%" height={40} />
                  )}
                  <Divider />
                  </>}
                  {isDataReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Presale Start Time")}</Text>
                    <Text small>{new Date(data?.presaleStartTimestamp * 1000).toUTCString()}</Text>
                  </Flex> : (
                    <Skeleton width="100%" height={40} />
                  )}
                  <Divider />
                  {isDataReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Presale End Time")}</Text>
                    <Text small>{new Date(data?.presaleEndTimestamp * 1000).toUTCString()}</Text>
                  </Flex> : (
                    <Skeleton width="100%" height={40} />
                  )}
                  <Divider />
                  {isDataReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Listing On")}</Text>
                    <Text small>{data.liquidity === 0 ? t("Manual listing") : t("Duckstail DEX")}</Text>
                  </Flex> : <Skeleton width="100%" height={40} />}
                  <Divider />
                  {isDataReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Liquidity Percent")}</Text>
                    <Text small>{data.liquidity === 0 ? "Manual listing" : `${data?.liquidity/10} %`}</Text>
                  </Flex> : <Skeleton width="100%" height={40} />}
                  <Divider />
                  {isDataReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text small>{t("Liquidity Lockup Time")}</Text>
                    <Text small>{data.liquidity === 0 ? "Unlocked" : `${data?.lockPeriod / 24 / 3600} days`}</Text>
                  </Flex> : <Skeleton width="100%" height={40} />}
                </Box>
              </Box>
            </Box>
          </StyledAppBody>
        </Box>
        <Box 
          maxWidth={["100%", "100%", "100%", "100%", "100%", "100%", "100%"]} 
          minWidth={["100%", "100%", "100%", "100%", "100%", "100%", "35%"]} 
          mt={["15px", "15px", "15px", "15px", "15px", "15px", "0"]}
        >
          <StyledAppBody>
            <Box p="20px">
              {isDataReady ? <Flex justifyContent="center">
                <Text color="primary" fontSize="18px">{t(banText)}</Text>
              </Flex> : <Skeleton width="100%" height={50} />}
              {isDataReady ? <Flex justifyContent="center" mt="10px">
                <StyledBox><Text fontSize="18px">{countdown[0]}</Text></StyledBox>
                <StyledBox ml="5px"><Text fontSize="18px">{countdown[1]}</Text></StyledBox>
                <StyledBox ml="5px"><Text fontSize="18px">{countdown[2]}</Text></StyledBox>
                <StyledBox ml="5px"><Text fontSize="18px">{countdown[3]}</Text></StyledBox>
              </Flex> : <Skeleton width="100%" height={50} />}
              {isDataReady ? <ProgressBase cap={data.hardCap} pos={data.totalDepositedBalance}>
                <ProgressBar cap={data.hardCap} pos={data.totalDepositedBalance} />
              </ProgressBase> : <Skeleton width="100%" height={40} />}
              {isBuyTokenReady && isDataReady ? <Flex justifyContent="space-between">
                <Text>{data.totalDepositedBalance / 10**searchBuyToken.decimals} {searchBuyToken.symbol}</Text>
                <Text>{data.hardCap / 10**searchBuyToken.decimals} {searchBuyToken.symbol}</Text>
              </Flex> : <Skeleton width="100%" height={40} />}
              {isDataReady ? <Flex justifyContent="right" mt="10px">
                <Button
                  onClick={onPresentDeposit}
                  disabled={status !== "live"}
                >
                  {t("Deposit")}
                </Button>
              </Flex> : <Skeleton width="100%" height={60} />}
            </Box>
          </StyledAppBody>
          <StyledAppBody mt="16px">
            <Box p="20px">
              {isDataReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text small>{t("Status")}</Text>
                <Text small color="primary">{status}</Text>
              </Flex> : <Skeleton width="100%" height={40} />}
              <Divider />
              {isDataReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text small>{t("Sale Type")}</Text>
                <Text small color="primary">{whitelist ? t("Whitelist Only") : t("Public")}</Text>
              </Flex> : <Skeleton width="100%" height={40} />}
              <Divider />
              {isDataReady && isBuyTokenReady && isTokenReady && data.presaleType === "fair" && <><Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text small>{t("Current Rate")}</Text>
                <Text small>{`1 ${searchBuyToken.symbol} = ${(data.total / (data.totalDepositedBalance === 0 ? data.softCap : data.totalDepositedBalance) * 10**searchBuyToken.decimals / 10**searchToken.decimals).toLocaleString()} ${searchToken.symbol}`}</Text>
              </Flex>
              <Divider /></>}
              {isDataReady && isBuyTokenReady && data.presaleType === "standard" && <><Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text small>{t("Minimum Buy")}</Text>
                <Text small>{data.minBuy / 10**searchBuyToken.decimals} {searchBuyToken.symbol}</Text>
              </Flex>
              <Divider /></>}
              {isDataReady && isBuyTokenReady && data.maxBuy !== 0 && <><Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text small>{t("Maximum Buy")}</Text>
                <Text small>{data.maxBuy / 10**searchBuyToken.decimals} {searchBuyToken.symbol}</Text>
              </Flex>
              <Divider /></>}
              {isDataReady ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text small>{t("Total Contributors")}</Text>
                <Text small>{data.investors}</Text>
              </Flex> : <Skeleton width="100%" height={40} />}
              <Divider />
              {isBuyTokenReady && userDataLoaded ? <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text small>{t("You purchased")}</Text>
                <Text small>{data.userData.deposit / 10**searchBuyToken.decimals} {searchBuyToken.symbol}</Text>
              </Flex> : <Skeleton width="100%" height={40} />}
            </Box>
          </StyledAppBody>
          {isTokenReady && isBuyTokenReady && userDataLoaded && data.userData.owner && <StyledAppBody mt="16px">
            <Box p="20px">
              <Box mb="15px">
                <Text bold color="primary">{t("Owner Zone")}</Text>
              </Box>
              <Box mb="15px">
                <Message variant="warning" icon={false} p="8px 0">
                  <MessageText color="text">
                    {t('To make sure there will be no issues during the presale time, please do not send tokens to wallets before you finalize the presale pool.')}
                  </MessageText>
                </Message>
              </Box>
              <Box mb="15px">
                <Message variant="success" icon={false} p="8px 0">
                  <MessageText color="text">
                    {t('Pool Fee:')} {data.mainFee === 50 ? `5% ${searchBuyToken.symbol} raised only` : `2% ${searchBuyToken.symbol} raised + 2% ${searchToken.symbol} sold`}
                  </MessageText>
                </Message>
              </Box>
              <Box mb="15px">
                <Text color="primary" fontSize="12px">{t("Sale Type")}</Text>
                <Flex>
                  <Flex width="100%" alignItems="center" onClick={handleShowPublicSaleModal}>
                    <Checkbox
                      scale="sm"
                      checked={whitelist === true}
                      readOnly
                    />
                    <Text ml="10px">{t("Public")}</Text>
                  </Flex>
                  <Flex width="100%" alignItems="center" ml="25px" onClick={handleShowWhitelistedSaleModal}>
                    <Checkbox
                      scale="sm"
                      checked={whitelist === false}
                      readOnly
                    />
                    <Text ml="10px">{t("Whitelist")}</Text>
                  </Flex>
                </Flex>
                {!whitelist && <Box width="100%" mt="10px">
                  <Button
                    scale="sm"
                    variant="secondary"
                    width="100%"
                    mb="10px"
                    onClick={onPresentEnableWhitelist}
                  >
                    <Text fontSize="14px">{t("Update Whitelist Setting")}</Text>
                  </Button>
                  <Button
                    scale="sm"
                    variant="secondary"
                    width="100%"
                    mb="10px"
                    onClick={onPresentAddWhitelist}
                  >
                    <Text fontSize="14px">{t("Add users to whitelist")}</Text>
                  </Button>
                  <Button
                    scale="sm"
                    variant="secondary"
                    width="100%"
                    onClick={onPresentRemoveWhitelist}
                  >
                    <Text fontSize="14px">{t("Remove users from whitelist")}</Text>
                  </Button>
                </Box>}
              </Box>
              <Box mb="15px">
                <Text color="primary" fontSize="12px">{t("Pool Actions")}</Text>
                {/* <Button
                  scale="sm"
                  variant="secondary"
                  width="100%"
                  mt="5px"
                >
                  <Text fontSize="14px">{t("Pool Start/End Time Settings")}</Text>
                </Button> */}
                <Button
                  scale="sm"
                  variant="secondary"
                  width="100%"
                  mt="5px"
                  disabled={data.claimable || data.refundable || (Date.now() /1000 < data.presaleEndTimestamp && data.totalDepositedBalance < data.softCap)}
                  onClick={onPresentFinalize}
                >
                  <Text fontSize="14px">{t("Finalize")}</Text>
                </Button>
                <Button
                  scale="sm"
                  variant="secondary"
                  width="100%"
                  mt="5px"
                  disabled={data.claimable || data.refundable}
                  onClick={onPresentCancel}
                >
                  <Text fontSize="14px">{t("Cancel Pool")}</Text>
                </Button>
              </Box>
              <Box mb="15px">
                <Text color="primary" fontSize="12px">{t("Other Actions")}</Text>
                <Button
                  scale="sm"
                  variant="secondary"
                  width="100%"
                  mt="5px"
                  onClick={onPresentUpdateInfo}
                >
                  <Text fontSize="14px">{t("Update Information")}</Text>
                </Button>
              </Box>
            </Box>
          </StyledAppBody>}
        </Box>
      </Flex>
    </Page>
  )
}

export default Launchpad