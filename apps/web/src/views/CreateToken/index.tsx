import { useState } from 'react'
import styled from 'styled-components'
import { Currency } from '@pancakeswap/sdk'
import { Card, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import { FinishData, TokenData, TokenFormView } from './types'
import Page from '../Page'
import { VerifyTokenForm } from './components/VerifyTokenForm'
import { FinishForm } from './components/FinishForm'
// import { QuoteForm } from './components/QuoteForm'

export const StyledAppBody = styled(Card)`
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`
const Launchpad: React.FC<React.PropsWithChildren> = () => {
  const [modalView, setModalView] = useState<TokenFormView>(TokenFormView.Create)

  const [ tokenData, setTokenData ] = useState<TokenData>({
    name: "",
    symbol: "",
    decimals: "",
    totalSupply: "",
    type: "standard",
    liquidityGen: undefined,
    baby: undefined,
    buyBackBaby: undefined
  })

  const [finishData, setFinishData] = useState<FinishData>({
    address: "",
    hash: "",
    chainId: 42161
  })

  return (
    <Page>
      <StyledAppBody mb="24px">
        {
          modalView === TokenFormView.Create && 
          <VerifyTokenForm
            setModalView={setModalView}
            tokenData={tokenData}
            setTokenData={setTokenData}
            setFinishData={setFinishData}
          />
        }
        {
          modalView === TokenFormView.Finish && 
          <FinishForm
            setModalView={setModalView}
            tokenData={tokenData}
            finishData={finishData}
            setTokenData={setTokenData}
            setFinishData={setFinishData}
          />
        }
      </StyledAppBody>
    </Page>
  )
}

export default Launchpad
