import { SerializedBond } from '@pancakeswap/capital'
import { useTranslation } from '@pancakeswap/localization'
import { Card, ExpandableSectionButton, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import CardActionsContainer from './CardActionsContainer'
import CardHeading from './CardHeading'
import { DetailsSection } from './DetailsSection'

const StyledCard = styled(Card)`
  align-self: baseline;
  max-width: 100%;
  margin: 0 0 24px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 350px;
    margin: 0 12px 46px;
  }
`

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`

const ExpandingWrapper = styled.div`
  padding: 24px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
`

interface BondCardProps {
  bond: SerializedBond
  removed: boolean
  dcpPrice?: BigNumber
  account?: string
  originalLiquidity?: BigNumber
}

const BondCard: React.FC<React.PropsWithChildren<BondCardProps>> = ({
  bond,
  removed,
  account,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: bond.token0.address,
    tokenAddress: bond.token0.address,
    chainId,
  })

  const toggleExpandableSection = useCallback(() => {
    setShowExpandableSection((prev) => !prev)
  }, [])

  return (
    <StyledCard>
      <FarmCardInnerContainer>
        <CardHeading
          token0={bond.token0}
          token1={bond.token1}
          isTokenOnly={!bond.lpBond}
        />
        {!removed && (
          <Flex justifyContent="space-between" alignItems="center">
            <Text>{t('Price')}:</Text>
            <Text bold style={{ display: 'flex', alignItems: 'center' }}>
              {bond?.bondPriceInUSD ? (
                `${bond?.bondPriceInUSD} USD`
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>
        )}
        <Flex justifyContent="space-between">
          <Text>{t('ROI')}:</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
            {bond?.discount ? (
              `${new BigNumber(bond?.discount).times(100).toFixed(2)} %`
              ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Flex>
        <CardActionsContainer
          bond={bond}
          account={account}
        />
      </FarmCardInnerContainer>

      <ExpandingWrapper>
        <ExpandableSectionButton onClick={toggleExpandableSection} expanded={showExpandableSection} />
        {showExpandableSection && (
          <DetailsSection
            bond={bond}
            scanAddressLink={getBlockExploreLink(bond.bondAddress, 'address', chainId)}
          />
        )}
      </ExpandingWrapper>
    </StyledCard>
  )
}

export default BondCard