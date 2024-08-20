import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { BIG_TEN } from '@pancakeswap/utils/bigNumber'
import {
  Text,
  Flex,
  Skeleton,
  Heading,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
// import useTheme from 'hooks/useTheme'
import { useCapital, usePollBondsWithUserData } from 'state/capital/hooks'
import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import StakeComponent from './components/StakeComponent'

const StepContainer = styled(Flex)`
  gap: 24px;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }
`

const StyledStepCard = styled(Flex)`
  display: flex;
  width: 100%;
  align-self: baseline;
  position: relative;
  padding: 1px 1px 3px 1px;
  border-radius: 8px;
  margin: 5px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: auto;
  }
`

const StepCardInner = styled(Flex)`
  display: flex;
  width: 100%;
  border-radius: 8px;
  flex-direction: row;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: column;
  }
`

const StyledFlex = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  width: 90%;
  border-radius: 16px;
  padding: 30px;
  position: relative;
  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 900px;
  }
`

type Step = { title: string; label: string }

const StepCard: React.FC<React.PropsWithChildren<{ step: Step }>> = ({ step }) => {
  return (
    <StyledStepCard>
      <StepCardInner>
        <Text mb="16px" fontSize="16px" bold>
          {step.label}
        </Text>
        {step.title === "" ? 
          <Skeleton width={100} height={27} mb={16}/> 
            : 
          <Heading mb="16px" scale="lg" color="secondary">
            {step.title}
          </Heading>
        }
      </StepCardInner>
    </StyledStepCard>
  )
}

const Vault: React.FC<React.PropsWithChildren> = () => {
  const { vault, userDataLoaded } = useCapital()

  const { stakingAPY } = vault || {}

  const trimmedStakingAPY = Number(stakingAPY) > 100000 ? 
    parseFloat((Number(stakingAPY) * 100).toString()) : 
    (Number(stakingAPY) * 100).toFixed(3);


  const { t } = useTranslation()

  const { address: account } = useAccount()

  usePollBondsWithUserData()

  // const userDataReady = !account || (!!account && userDataLoaded)

  const steps1: Step[] = [
    {
      label: t('Annual Percentage Yield'),
      title: vault ? `${Number(trimmedStakingAPY).toLocaleString()} %` : '',
    },
    {
      label: t('Total Deposited'),
      title: vault ? `${Number(vault.stakingTVL).toLocaleString()} USD` : '',
    },
    {
      label: t('Current Index'),
      title: vault ? `${(Number(vault.currentIndex) / 10**9).toLocaleString()} DCP` : '',
    },
  ]

  const steps2: Step[] = [
    {
      label: t('Next Reward Yield'),
      title: vault ? `${new BigNumber(vault.stakingRebase).times(100).toNumber().toLocaleString()} %` : '',
    },
    {
      label: t('ROI (5-Day Rate)'),
      title: vault ? `${(Number(vault.fiveDayRate) * 100).toLocaleString()} %` : '',
    },
  ]

  const steps3: Step[] = [
    {
      label: t('Your DCP Balance'),
      title: userDataLoaded ? `${new BigNumber(vault.userData.dcp.balance).div(BIG_TEN.pow(9)).toNumber().toLocaleString()} DCP` : '',
    },
    {
      label: t('Your SDCP Balance'),
      title: userDataLoaded ? `${Number(vault.userData.sdcp.balance).toLocaleString()} USD` : '',
    },
    {
      label: t('Next Reward Amount'),
      title: userDataLoaded ? `${new BigNumber(vault.userData.sdcp.balance).times(vault.stakingRebase).toNumber().toLocaleString()} SDCP` : '',
    },
  ]

  return (
      <Page>
        {/* <ControlContainer>
          <ViewControls>
            <Flex>
              
            </Flex>
          </ViewControls>
          <FilterContainer>
            <LabelWrapper style={{ marginLeft: 16 }}>
              
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer> */}
        <Flex justifyContent="center" width="100%">
          <StyledFlex flexDirection="column" width="100%">
            <Flex justifyContent="center" margin="auto" width="100%">
              <StepContainer>
                {steps1.map((step) => (
                  <StepCard key={step.label} step={step} />
                ))}
              </StepContainer>
            </Flex>
            <Flex justifyContent="center" margin="auto" width="100%" mt="24px">
              <StepContainer>
                {steps2.map((step) => (
                  <StepCard key={step.label} step={step} />
                ))}
              </StepContainer>
            </Flex>
            <Flex justifyContent="center" margin="auto" width="100%" mt="24px">
              <StepContainer>
                {steps3.map((step) => (
                  <StepCard key={step.label} step={step} />
                ))}
              </StepContainer>
            </Flex>
          
            <Flex justifyContent="center" mt="30px">
              {!account ? 
                <ConnectWalletButton width="100%" /> :
                <StakeComponent vault={vault} />
              }
            </Flex>
          </StyledFlex>
        </Flex>
      </Page>
  )
}

export default Vault
