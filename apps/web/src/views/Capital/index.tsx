import styled from 'styled-components'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Box, Flex, Text, Heading, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useCapital, usePollBondsWithUserData } from 'state/capital/hooks'

const Page = styled.div`
  min-height: calc(100vh - 167px);
  padding: 0 50px;
`

const StepContainer = styled(Flex)`
  gap: 24px;
  width: 100%;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
  }
`

const StyledStepCard = styled(Box)`
  display: flex;
  align-self: baseline;
  position: relative;
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  padding: 1px 1px 3px 1px;
  border-radius: 8px;
  margin: 5px;
`

const StepCardInner = styled(Box)`
  width: 100%;
  padding: 24px;
  border-radius: 8px
`

type Step = { title: string; subtitle: string; label: string }

const StepCard: React.FC<React.PropsWithChildren<{ step: Step }>> = ({ step }) => {
  return (
    <StyledStepCard width="100%">
      <StepCardInner height={['200px', '180px', null, '200px']}>
        <Text mb="16px" fontSize="16px" bold textAlign="right">
          {step.label}
        </Text>
        {step.title === "" ? 
          <Skeleton width={100} height={27} mb={16}/> 
            : 
          <Heading mb="16px" scale="lg" color="secondary">
            {step.title}
          </Heading>
        }
        <Text color="textSubtle">{step.subtitle}</Text>
      </StepCardInner>
    </StyledStepCard>
  )
}

const Capital: React.FC<React.PropsWithChildren> = () => {

  const { bonds, vault, userDataLoaded } = useCapital()

  const { address: account } = useAccount()

  usePollBondsWithUserData()

  // const userDataReady = !account || (!!account && userDataLoaded)

  const treasuryBalances = bonds.map((bond) => bond.purchased)

  const totalPurchased = treasuryBalances.reduce((value0, value1) => new BigNumber(value0).plus(new BigNumber(value1)), BIG_ZERO)

  const { t } = useTranslation()

  const steps1: Step[] = [
    {
      label: t('DCP Price'),
      title: vault ? `${Number(vault.marketPrice).toLocaleString()} USD` : '',
      subtitle: t(''),
    },
    {
      label: t('MarketCap'),
      title: vault ? `${Number(vault.marketCap).toLocaleString()} USD` : '',
      subtitle: t(''),
    },
    {
      label: t('Circulating Supply'),
      title: vault ? `${(Number(vault.circSupply) / 10**9).toLocaleString()} DCP` : '',
      subtitle: t(''),
    },
  ]

  const steps2: Step[] = [
    {
      label: t('Backing per DCP'),
      title: t('1 USD'),
      subtitle: t(''),
    },
    {
      label: t('Current Index'),
      title: vault ? `${(Number(vault.currentIndex) / 10**9).toLocaleString()} DCP` : '',
      subtitle: t(''),
    },
    {
      label: t('Treasury Balance'),
      title: vault ? `${totalPurchased.toLocaleString()} USD` : '',
      subtitle: t(''),
    },
  ]
  return (
    <Page>
      <Box width="100%">
        <Flex my="50px" alignItems="center" flexDirection="column">
          <Text mb="20px" color="secondary" bold fontSize="28px">
            {t('Welcome to DuckStail Capital')}
          </Text>
          <Text textAlign="center">
            {t(
              'Duckstail Capital is the decentralized reserve currency protocol available on the Arbitrum network based on the DCP token.',
            )}
          </Text>
        </Flex>
        <Flex justifyContent="center">
          <StepContainer>
            {steps1.map((step) => (
              <StepCard key={step.label} step={step} />
            ))}
          </StepContainer>
        </Flex>
        <Flex justifyContent="center">
          <StepContainer>
            {steps2.map((step) => (
              <StepCard key={step.label} step={step} />
            ))}
          </StepContainer>
        </Flex>
      </Box>
    </Page>
  )
}

export default Capital
