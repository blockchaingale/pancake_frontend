import { useState } from 'react'
import styled from 'styled-components'
import { Currency } from '@pancakeswap/sdk'
import { Card } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import Page from '../Page'
import { InputForm } from './components/InputForm'
import { QuoteForm } from './components/QuoteForm'

export const StyledAppBody = styled(Card)`
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`
const Airdrop: React.FC<React.PropsWithChildren> = () => {
  const [modalView, setModalView] = useState<CryptoFormView>(CryptoFormView.Input)

  const [ data, setData ] = useState<DataType[]>([])

  const [ tag, setTag ] = useState<string>("")
  
  const native = useNativeCurrency()

  const [currency, setCurrency] = useState<Currency | null>(() => native)

  // const { t } = useTranslation()

  return (
    <Page>
      {/* <Text mb="20px" color="secondary" bold fontSize="28px">
        {t('PentaCoin Airdrop')}
      </Text> */}
      <StyledAppBody mb="24px">
        {modalView === CryptoFormView.Input ? (
          <InputForm setModalView={setModalView} setData={setData} tag={tag} setTag={setTag} currency={currency} setCurrency={setCurrency} />
        ) : (
          <QuoteForm setModalView={setModalView} data={data} tag={tag} currency={currency} />
        )}
      </StyledAppBody>
    </Page>
  )
}

export default Airdrop
