// import { CHAIN_IDS } from 'utils/wagmi'
// import Bridge from '../views/Bridge'
// import { SwapFeaturesProvider } from '../views/Swap/SwapFeaturesContext'

// const BridgePage = () => {
//   return (
//     // <SwapFeaturesProvider>
//       <Bridge />
//     // </SwapFeaturesProvider>
//   )
// }

// BridgePage.chains = CHAIN_IDS

// export default BridgePage

import Script from 'next/script'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import styled, { useTheme } from 'styled-components'
import { ChainId } from '@pancakeswap/sdk'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import { STARGATE_JS } from '../components/stargate/config'
import { StargateWidget } from '../components/stargate'

const Page = styled.div`
//   height: 100%;
  display: flex;
  justify-content: center;
  min-height: calc(100% - 56px);
  align-items: center;
  flex-direction: column;
  margin-bottom: 100px;
//   background: ${({ theme }) => theme.colors.gradientBubblegum};

  ${({ theme }) => theme.mediaQueries.sm} {
    display: grid;
    place-content: center;
  }
`

declare global {
  interface Window {
    // Stargate custom element api
    stargate?: any
  }
}

function Bridge() {
  const theme = useTheme()

  const [show, setShow] = useState(false)

  useEffect(() => {
    customElements.whenDefined('stargate-widget').then(() => {
      setTimeout(() => {
        if (window.stargate) {
          window.stargate.setDstChainId(102)
        }
      }, 600)
      console.info('stargate widget mount')
      setShow(true)
    })
  }, [])

  return (
    <Page>
      <Script crossOrigin="anonymous" src={STARGATE_JS.src} integrity={STARGATE_JS.integrity} />
      <Flex
        flexDirection="column"
        width={['100%', null, '384px']}
        bg="backgroundAlt"
        borderRadius={[8, null, 8]}
        alignItems="center"
        // height="100%"
      >
        <StargateWidget theme={theme} />
        {/* {show && (
          <Box display={['block', null, 'block']}>
            <PoweredBy />
          </Box>
        )} */}
      </Flex>
      {/* {show && (
        <Box display={['none', null, 'block']}>
          <PoweredBy />
        </Box>
      )} */}
    </Page>
  )
}

function PoweredBy() {
  const { isDark } = useTheme()
  return (
    <Flex py="10px" alignItems="center" justifyContent="center">
      <Text small color="textSubtle" mr="8px">
        Powered By
      </Text>
      <a href="https://layerzero.network/" target="_blank" rel="noreferrer noopener">
        <Image
          width={75}
          height={25}
          src="/images/layerZero.svg"
          alt="Powered By LayerZero"
          unoptimized
          style={{
            filter: isDark ? 'invert(1)' : 'unset',
          }}
        />
      </a>
    </Flex>
  )
}

Bridge.chains = [ChainId.ARBITRUM, ChainId.ETHEREUM, ChainId.BSC, ChainId.POLYGON]

export default Bridge


// import { NotFound } from '@pancakeswap/uikit'

// const NotFoundPage = () => <NotFound />

// NotFoundPage.chains = []

// export default NotFoundPage