import styled from 'styled-components'
import { Flex, Heading, Farm as FarmUI } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { SerializedWrappedToken } from '@pancakeswap/token-lists'
import { STokenImage, STokenPairImage, TokenImage, TokenPairImage } from 'components/TokenImage'

export interface ExpandableSectionProps {
  token0: SerializedWrappedToken
  token1: SerializedWrappedToken
  isTokenOnly?: boolean
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const CardHeading: React.FC<React.PropsWithChildren<ExpandableSectionProps>> = ({
  token0,
  token1,
  isTokenOnly
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      {
        isTokenOnly ?
        <STokenImage token={token0} width={64} height={64} />
        :
        <STokenPairImage variant="inverted" primaryToken={token0} secondaryToken={token1} width={64} height={64} />
      }
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">{isTokenOnly ? `${token0.symbol} BOND` : `${token0.symbol}-${token1.symbol} BOND`}</Heading>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
