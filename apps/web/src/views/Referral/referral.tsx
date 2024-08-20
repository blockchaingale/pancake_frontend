import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'
import Page from '../Page'
// eslint-disable-next-line import/named
import { ReferralForm } from './components/Referral'

export const StyledAppBody = styled(Card)`
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`
const History: React.FC<React.PropsWithChildren> = () => {
  return (
    <Page>
      <StyledAppBody mb="24px" mt="48px">
        <ReferralForm />
      </StyledAppBody>
    </Page>
  )
}

export default History
