// import { useState } from 'react'
import styled from 'styled-components'
// import { Currency } from '@pancakeswap/sdk'
import { Card } from '@pancakeswap/uikit'
// import { useTranslation } from '@pancakeswap/localization'
// import useNativeCurrency from 'hooks/useNativeCurrency'
// import { CryptoFormView, DataType } from 'views/Airdrop/types'
import Page from '../Page'
import { HistoryForm } from './components/History'

export const StyledAppBody = styled(Card)`
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`
const History: React.FC<React.PropsWithChildren> = () => {
  return (
    <Page>
      <StyledAppBody mb="24px">
        <HistoryForm />
      </StyledAppBody>
    </Page>
  )
}

export default History
