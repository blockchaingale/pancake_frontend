import { useTranslation } from '@pancakeswap/localization'
import {
  Farm as FarmUI,
  LinkExternal,
  Text,
  useMatchBreakpoints,
  Skeleton,
} from '@pancakeswap/uikit'

import BigNumber from 'bignumber.js'

import { SerializedBond } from '@pancakeswap/capital'
import { useActiveChainId } from 'hooks/useActiveChainId'
import styled, { css, keyframes } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'

import { HarvestAction, HarvestActionContainer } from './HarvestAction'
import StakedAction, { StakedContainer } from './StakedAction'

export interface ActionPanelProps {
  bond: SerializedBond
  userDataReady: boolean
  expanded: boolean
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`

const Container = styled.div<{ expanded }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    align-items: center;
    padding: 16px 32px;
  }
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
    flex-wrap: wrap;
  }
`

const InfoContainer = styled.div`
  min-width: 200px;
`

const ValueContainer = styled.div``

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`

const ActionPanel: React.FunctionComponent<React.PropsWithChildren<ActionPanelProps>> = ({
  bond,
  userDataReady,
  expanded,
}) => {
  const { chainId } = useActiveChainId()

  const { isDesktop } = useMatchBreakpoints()

  const { t } = useTranslation()
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: bond.token0.address,
    tokenAddress: bond.token1.address,
    chainId,
  })

  const bsc = getBlockExploreLink(bond.bondAddress, 'address', chainId)

  return (
    <Container expanded={expanded}>
      <InfoContainer>
        <ValueContainer>
          {!isDesktop && (
            <>
              <ValueWrapper>
                <Text>{t('ROI')}</Text>
                <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                  {bond?.discount ? (
                    `${new BigNumber(bond?.discount).times(100).toFixed(2)} %`
                  ) : (
                    <Skeleton height={24} width={80} />
                  )}
                </Text>
              </ValueWrapper>
              <ValueWrapper>
                <Text>{t('Purchased')}</Text>
                <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                  {bond?.purchased ? (
                    `${bond?.purchased} USD`
                  ) : (
                    <Skeleton height={24} width={80} />
                  )}
                </Text>
              </ValueWrapper>
            </>
          )}
        </ValueContainer>
        <StakeContainer>
          <StyledLinkExternal href={!bond.lpBond ? `/swap?outputCurrency=${bond.bondToken.address}` : `/add/${liquidityUrlPathParts}`}>
            {t('Get %symbol%', { symbol: bond.displayName })}
          </StyledLinkExternal>
        </StakeContainer>
        <StyledLinkExternal isBscScan href={bsc}>
          {t('View Contract')}
        </StyledLinkExternal>
      </InfoContainer>
      <ActionContainer>
        <HarvestActionContainer bond={bond} userDataReady={userDataReady}>
          {(props) => <HarvestAction {...props} />}
        </HarvestActionContainer>
        <StakedContainer bond={bond} userDataReady={userDataReady}>
          {(props) => <StakedAction {...props} />}
        </StakedContainer>
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
