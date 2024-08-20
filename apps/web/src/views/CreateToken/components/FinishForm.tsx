import { Dispatch, SetStateAction } from 'react'
// import { isAddress } from '@ethersproject/address'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Box, Button, Flex, Link, NextLinkFromReactRouter, LinkExternal } from '@pancakeswap/uikit'
import { getBlockExploreLink } from 'utils'
import { TokenFormView, TokenData, FinishData } from '../types'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'

const accountEllipsis = (address: string) => {
  return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : null
}

export function FinishForm({
  setModalView,
  tokenData,
  finishData,
  setTokenData,
  setFinishData,
}: {
  setModalView: Dispatch<SetStateAction<TokenFormView>>
  tokenData: TokenData
  finishData: FinishData
  setTokenData: Dispatch<SetStateAction<TokenData>>
  setFinishData: Dispatch<SetStateAction<FinishData>>
}) {
  const { t } = useTranslation()

  // const accountEllipsis = finishData.address ? `${finishData.address.substring(0, 6)}...${finishData.address.substring(finishData.address.length - 4)}` : null;

  const handleReturn = async () => {
    setTokenData({
      name: "",
      symbol: "",
      decimals: "",
      totalSupply: "",
      type: "standard",
      liquidityGen: undefined,
      baby: undefined,
      buyBackBaby: undefined
    })

    setFinishData({
      address: "",
      hash: "",
      chainId: 42161
    })

    setModalView(TokenFormView.Create)
  }

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Congratulation!')} subTitle={t('You\'ve just created %symbol%', {symbol: tokenData.name})} />
      <FormContainer>
        {/* <ProgressCirclesFullCompleted steps={[true, true, true]} /> */}
        {/* <Box>
          <Text fontSize="16px" bold color="primary">{t("Congratulation!")}</Text>
          <Text fontSize="12px">{t("You've just created launchpad")}</Text>
        </Box> */}
        <Box>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Name")}</Text>
            <Text>{tokenData.name}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Symbol")}</Text>
            <Text>{tokenData.symbol}</Text>
          </Flex>
          {tokenData.type === "standard" && <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Decimals")}</Text>
            <Text>{tokenData.decimals}</Text>
          </Flex>}
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Address")}</Text>
            <LinkExternal href={getBlockExploreLink(finishData.address, 'token', finishData.chainId)}>
              <Text color="primary">{accountEllipsis(finishData.address)}</Text>
            </LinkExternal>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
            <Text color="primary">{t("Total Supply")}</Text>
              <Text>{Number(tokenData.totalSupply).toLocaleString()}</Text>
          </Flex>
          {/* {tokenData.type === "liquidityGen" && <>
            <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
              <Text color="primary">{t("Tax Fee")}</Text>
              <Text>{t("%symbol% %", {symbol: tokenData.liquidityGen.taxFee1})}</Text>
            </Flex>
            <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
              <Text color="primary">{t("Liquidity Fee")}</Text>
              <Text>{t("%symbol% %", {symbol: tokenData.liquidityGen.liquidityFee1})}</Text>
            </Flex>
            <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
              <Text color="primary">{t("Marketing Fee")}</Text>
              <Text>{t("%symbol% %", {symbol: tokenData.liquidityGen.charityFee1})}</Text>
            </Flex>
            <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
              <Text color="primary">{t("Marketing Address")}</Text>
              <LinkExternal href={getBlockExploreLink(tokenData.liquidityGen.charityAddr1, 'address', finishData.chainId)}>
                <Text color="primary">{t("%symbol%", {symbol: accountEllipsis(tokenData.liquidityGen.charityAddr1)})}</Text>
              </LinkExternal>
            </Flex>
          </>} */}
        </Box>
        <Flex width="100%" alignItems="center" flexDirection={["column", "column", "row"]}>
          <Box mr={["0", "0", "15px"]} mb={["10px", "10px", "0"]} width="100%">
            <Link width="100% !important" external href={getBlockExploreLink(finishData.hash, 'transaction', finishData.chainId)}>
              <Button
                width="100%"
                variant="secondary"
              ><Text color="primary" bold fontSize="14px">{t("View Transaction")}</Text></Button>
            </Link>
          </Box>
          <Box width="100%">
            {/* <Link width="100% !important" external href={getBlockExploreLink(finishData.address, 'token', finishData.chainId)}> */}
            <Button
              width="100%"
              // variant="secondary"
              onClick={handleReturn}
            ><Text color="invertedContrast" bold fontSize="14px">{t("Create Other")}</Text></Button>
            {/* </Link> */}
          </Box>
        </Flex>
        <Flex width="100%" alignItems="center" flexDirection={["column", "column", "row"]}>
          <Box mr={["0", "0", "15px"]} mb={["10px", "10px", "0"]} width="100%">
            <NextLinkFromReactRouter to="/launchpad">
              <Button
                width="100%"
              ><Text color="invertedContrast" bold fontSize="14px">{t("Create Launchpad")}</Text></Button>
            </NextLinkFromReactRouter>
          </Box>
          <Box width="100%">
            <NextLinkFromReactRouter to="/fair-launch">
              <Button
                width="100%"
              ><Text color="invertedContrast" bold fontSize="14px">{t("Create FairLaunch")}</Text></Button>
            </NextLinkFromReactRouter>
          </Box>
        </Flex>
      </FormContainer>
    </Box>
  )
}
