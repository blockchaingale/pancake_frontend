import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | MEME MAYHEM',
  defaultTitle: 'MEME MAYHEM',
  description:
    'Cheaper and faster than Uniswap? Discover MEME MAYHEM, the leading DEX on Multichain with the best farms in DeFi.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@',
    site: '@',
  },
  openGraph: {
    title: 'MEME MAYHEM - A next evolution DeFi exchange on Multichain',
    description:
      'The most popular AMM on BSC! Earn MM through yield farming, then stake it in Pools to earn more tokens!',
    images: [{ url: 'https://mememayhem.io/static/media/logo.89546edfe1b568667a94.png' }],
  },
}
