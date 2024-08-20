import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useContext } from 'react'
import styled from 'styled-components'
import { SerializedBond } from '@pancakeswap/capital'
import { HarvestActionContainer } from '../BondTable/Actions/HarvestAction'
import HarvestAction from './HarvestAction'
import StakeAction, { StakedContainer } from '../BondTable/Actions/StakedAction'

const Action = styled.div`
  padding-top: 16px;
`

const ActionContainer = styled.div`
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

interface BondCardActionsProps {
  bond: SerializedBond
  account?: string
}

const CardActions: React.FC<React.PropsWithChildren<BondCardActionsProps>> = ({
  bond,
  account,
}) => {
  const { t } = useTranslation()
  const { pendingPayout } = bond.userData || {}

  return (
    <Action>
      <Flex>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Pending Bond')}
        </Text>
        {/* <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pl="4px">
          DCP
        </Text> */}
      </Flex>
      <HarvestActionContainer
        bond={bond}
      >
        {(props) => <HarvestAction {...props} />}
      </HarvestActionContainer>
      {/* <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          {bond.bondToken.symbol}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Staked')}
        </Text>
      </Flex> */}
      {!account ? (
        <ConnectWalletButton mt="8px" width="100%" />
      ) : 
      (<StakedContainer bond={bond} isTokenOnly={!bond.lpBond}>
        {(props) => <StakeAction {...props} />}
      </StakedContainer>)}
    </Action>
  )
}

export default CardActions
