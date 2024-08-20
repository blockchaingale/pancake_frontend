import { TranslateFunction } from '@pancakeswap/localization'
import { SalesSectionProps } from '.'

import HeroImg from '../../../../../public/images/home/lunar-bunny/hero.png'
import CacaImg from '../../../../../public/images/home/lunar-bunny/caca.png'
import TradeImg from '../../../../../public/images/home/trade/trading.png'

export const swapSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Exchange anything, no signup, no fuss.'),
  bodyText: t('Swap any token on the Arbitrum BlockChain instantly, simply by linking your wallet.'),
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: t('Trade Now'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.mememayhem.io',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'BNB', alt: t('BNB token') },
      { src: 'BTC', alt: t('BTC token') },
      { src: 'MM', alt: t('MM token') },
    ],
  },
  background: HeroImg
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Earn passive income with crypto.'),
  bodyText: t('Duckstail makes it easy to make your crypto work for you.'),
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: t('Explore'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.mememayhem.io/tutorials/yield-farming',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [
      { src: 'pie', alt: t('Pie chart') },
      { src: 'stonks', alt: t('Stocks chart') },
      { src: 'folder', alt: t('Folder with cake token') },
    ],
  },
  background: CacaImg
})

export const cakeSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Nebula makes our world go round.'),
  bodyText: t(
    'MM token is at the heart of the Duckstail ecosystem. Buy it, farm it, spend it, stake it... heck, you can even vote with it!',
  ),
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=56',
    text: t('Buy MM'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.mememayhem.io/governance',
    text: t('Learn'),
    external: true,
  },

  images: {
    path: '/images/home/cake/',
    attributes: [
      { src: 'bottom-right', alt: t('Small 3d nebulaswap') },
      { src: 'top-right', alt: t('Small 3d nebulaswap') },
      { src: 'coin', alt: t('Nebula token') },
      { src: 'top-left', alt: t('Small 3d nebulaswap') },
    ],
  },
  background: TradeImg,
})
