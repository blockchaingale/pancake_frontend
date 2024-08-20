import { ChainId, Currency } from '@pancakeswap/sdk'
import { BinanceIcon, TokenLogo } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import styled from 'styled-components'
import { useHttpLocations } from '@pancakeswap/hooks'
import { BAD_SRCS } from './constants'
import getTokenLogoURL from '../../utils/getTokenLogoURL'

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return []

    if (currency?.isToken) {
      const tokenLogoURL = getTokenLogoURL(currency)

      if (currency instanceof WrappedTokenInfo) {
        if (!tokenLogoURL) return [...uriLocations]
        return [...uriLocations, tokenLogoURL]
      }
      if (!tokenLogoURL) return []
      return [tokenLogoURL]
    }
    return []
  }, [currency, uriLocations])

  if (currency?.isNative) {
    if (currency.chainId === ChainId.BSC) {
      return <BinanceIcon width={size} style={style} />
    }
    return (
      <StyledLogo
        badSrcs={BAD_SRCS}
        size={size}
        srcs={[`/images/chains/${currency.chainId}.png`]}
        width={size}
        style={style}
      />
    )
  }

  if (currency && currency.wrapped.address === "0x8A8BD24B8718dDdD878F45Ff909a4A55B7E7Fb90") {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/MayHem.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  if (currency && currency.wrapped.address === "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f" && currency.chainId === 42161) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/42161/tokens/0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  if (currency && currency.wrapped.address === "0x05dBe925606d1B0B3fC939FD6273036a89CD71F1" && currency.chainId === 42161) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/42161/tokens/0x05dBe925606d1B0B3fC939FD6273036a89CD71F1.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  if (currency && currency.wrapped.address === "0x912CE59144191C1204E64559FE8253a0e49E6548" && currency.chainId === 42161) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/42161/tokens/0x912CE59144191C1204E64559FE8253a0e49E6548.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  return (
    <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  )
}
