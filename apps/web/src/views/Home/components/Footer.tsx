import styled from 'styled-components'
import { Flex, Heading, Text, Link, useMatchBreakpoints, OpenNewIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/legacy/image'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { useAccount } from 'wagmi'
import SunburstSvg from './SunburstSvg'
import CompositeImage from './CompositeImage'
import BunnyImg from '../../../../public/images/home/flying-pancakes/planet.png'
import BunnyImg1 from '../../../../public/images/home/flying-pancakes/planet1.png'

const BgWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
`

const StyledSunburst = styled(SunburstSvg)`
  height: 350%;
  width: 350%;

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 400%;
    width: 400%;
  }
`

const Wrapper = styled(Flex)`
  z-index: 1;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const FloatingPancakesWrapper = styled(Container)`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;

  ${({ theme }) => theme.mediaQueries.md} {
    visibility: visible;
  }
`

const TopLeftImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  top: 15%;
`
const TopLeftImgWrapper1 = styled(Flex)`
  position: absolute;
  left: 15%;
  top: 40%;
`

const BottomRightImgWrapper = styled(Flex)`
  position: absolute;
  right: 0;
  top: 15%;
`

const BottomRightImgWrapper1 = styled(Flex)`
  position: absolute;
  right: 15%;
  top: 40%;
`

const topLeftImage = {
  path: '/images/home/flying-pancakes/',
  attributes: [
    { src: '1-bottom', alt: 'Pancake flying on the bottom' },
    { src: '1-left', alt: 'Pancake flying on the left' },
    { src: '1-top', alt: 'Pancake flying on the top' },
  ],
}

const bottomRightImage = {
  path: '/images/home/flying-pancakes/',
  attributes: [
    { src: '2-bottom', alt: 'Pancake flying on the bottom' },
    { src: '2-top', alt: 'Pancake flying on the top' },
    { src: '2-right', alt: 'Pancake flying on the right' },
  ],
}

const Footer = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isTablet, isDesktop } = useMatchBreakpoints()

  return (
    <>
      {/* <BgWrapper>
        <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
          <StyledSunburst />
        </Flex>
      </BgWrapper> */}
      {(isTablet || isDesktop) && (
        <FloatingPancakesWrapper>
          <TopLeftImgWrapper>
            {/* <CompositeImage {...topLeftImage} maxHeight="256px" /> */}
            <Image src={BunnyImg} priority placeholder="blur" alt={t('Lunar bunny')} />
            {/* <img src="/images/home/flying-pancakes/planet.png" width="256px" /> */}
          </TopLeftImgWrapper>
          <TopLeftImgWrapper1>
            {/* <CompositeImage {...topLeftImage} maxHeight="256px" /> */}
            <Image src={BunnyImg1} width={200} height={115} priority placeholder="blur" alt={t('Lunar bunny')} />
            {/* <img src="/images/home/flying-pancakes/planet.png" width="256px" /> */}
          </TopLeftImgWrapper1>
          <BottomRightImgWrapper>
            {/* <CompositeImage {...bottomRightImage} maxHeight="256px" /> */}
            <Image src={BunnyImg1} priority placeholder="blur" alt={t('Lunar bunny')} />
            {/* <img src="/images/home/flying-pancakes/planet.png" width="256px" /> */}
          </BottomRightImgWrapper>
          <BottomRightImgWrapper1>
            {/* <CompositeImage {...bottomRightImage} maxHeight="256px" /> */}
            <Image src={BunnyImg} width={200} height={115} priority placeholder="blur" alt={t('Lunar bunny')} />
            {/* <img src="/images/home/flying-pancakes/planet.png" width="256px" /> */}
          </BottomRightImgWrapper1>
        </FloatingPancakesWrapper>
      )}
      <Wrapper>
        <Heading mb="24px" scale="xl" color="spec">
          {t('Start in seconds.')}
        </Heading>
        <Text textAlign="center" color="primary">
          {t('Connect your crypto wallet to start using the app in seconds.')}
        </Text>
        <Text mb="24px" bold color="primary">
          {t('No registration needed.')}
        </Text>

        {/* <Link external href="https://docs.pancakeswap.finance/">
          {t('Learn how to start')}
          <OpenNewIcon color="primary" ml="4px" />
        </Link> */}
        {!account && <ConnectWalletButton mt="24px" variant="spec1" />}
      </Wrapper>
    </>
  )
}

export default Footer
