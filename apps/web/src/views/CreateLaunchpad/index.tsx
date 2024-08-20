import { useState } from 'react'
import styled from 'styled-components'
import { Currency } from '@pancakeswap/sdk'
import { Card, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import { FinishData, LaunchpadFormView, TokenData, Socials, DeFi } from './types'
import Page from '../Page'
import { VerifyTokenForm } from './components/VerifyTokenForm'
import { InformationForm } from './components/InformationForm'
import { SocialsForm } from './components/SocialsForm'
import { ReviewForm } from './components/ReviewForm'
import { FinishForm } from './components/FinishForm'
// import { QuoteForm } from './components/QuoteForm'

export const StyledAppBody = styled(Card)`
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`
const CreateLaunchpad: React.FC<React.PropsWithChildren> = () => {
  const [modalView, setModalView] = useState<LaunchpadFormView>(LaunchpadFormView.VerifyToken)
  const native = useNativeCurrency()

  const [ tokenData, setTokenData ] = useState<TokenData>({
    tokenAddress: "",
    tokenName: "",
    tokenDecimals: 0,
    tokenSymbol: "",
    currency: native,
    mainFee: "50",
    tokenFee: "0",
    listingOption: true
  })

  const [deFiData, setDeFiData] = useState<DeFi>({
    presaleRate: "",
    whitelist: false,
    softCap: "",
    hardCap: "",
    minimumBuy: "",
    maximumBuy: "",
    refundType: false,
    liquidity: "",
    listingRate: "",
    startTime: "",
    endTime: "",
    lockTime: "",
    totalAmount: "0",
    isVesting: false,
    vestingData: {
      vestingFirst: "0",
      vestingPeriod: "0",
      vestingEach: "0"
    }
  })

  const [socials, setSocials] = useState<Socials>({
    website: "",
    logoUrl: "",
    facebook: "",
    twitter: "",
    github: "",
    telegram: "",
    instagram: "",
    discord: "",
    reddit: "",
    youtube: "",
    whitelist: "",
    description: "",
  })

  const [presale, setPresale] = useState<FinishData>({address: ""})

  return (
    <Page>
      <StyledAppBody mb="24px">
        {
          modalView === LaunchpadFormView.VerifyToken && 
          <VerifyTokenForm
            setModalView={setModalView}
            tokenData={tokenData}
            setTokenData={setTokenData}
          />
        }
        {
          modalView === LaunchpadFormView.DeFiInfo && 
          <InformationForm
            setModalView={setModalView}
            tokenData={tokenData}
            deFiData={deFiData}
            setDefiData={setDeFiData}
          />
        }
        {
          modalView === LaunchpadFormView.Socials && 
          <SocialsForm
            setModalView={setModalView}
            tokenData={tokenData}
            deFiData={deFiData}
            socials={socials}
            setSocials={setSocials}
          />
        }
        {
          modalView === LaunchpadFormView.Review && 
          <ReviewForm
            setModalView={setModalView}
            tokenData={tokenData}
            deFiData={deFiData}
            socials={socials}
            setPresale={setPresale}
          />
        }
        {
          modalView === LaunchpadFormView.Finish && 
          <FinishForm
            setModalView={setModalView}
            tokenData={tokenData}
            deFiData={deFiData}
            socials={socials}
            setTokenData={setTokenData}
            setDefiData={setDeFiData}
            setSocials={setSocials}
            setPresale={setPresale}
            address={presale.address}
          />
        }
      </StyledAppBody>
    </Page>
  )
}

export default CreateLaunchpad
