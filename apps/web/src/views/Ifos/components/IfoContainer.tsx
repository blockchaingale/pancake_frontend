import { ReactElement } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Container, LinkExternal } from '@pancakeswap/uikit'
import IfoLayout, { IfoLayoutWrapper } from './IfoLayout'
// import IfoPoolVaultCard from './IfoPoolVaultCard'
import IfoQuestions from './IfoQuestions'

const IfoStepBackground = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

interface TypeProps {
  ifoSection: ReactElement
  ifoSteps: ReactElement
}

const IfoContainer: React.FC<React.PropsWithChildren<TypeProps>> = ({ ifoSection, ifoSteps }) => {
  const { t } = useTranslation()

  return (
    <IfoLayout id="current-ifo" py={['24px', '24px', '40px']}>
      <Container>
        <IfoLayoutWrapper>
          {/* <IfoPoolVaultCard /> */}
          {ifoSection}
        </IfoLayoutWrapper>
      </Container>
      <Box>
      <Container>{ifoSteps}</Container>
      </Box>
      <Container>
        <IfoQuestions />
      </Container>
    </IfoLayout>
  )
}

export default IfoContainer
