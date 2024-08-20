import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Box, Flex } from '@pancakeswap/uikit'
// import { Currency } from '@pancakeswap/sdk'
// import { MMTOKEN, arbitrumTokens } from '@pancakeswap/tokens'
import { useRouter } from 'next/router'
// import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
// import Row from 'components/Layout/Row'
// import { CurrencyLogo } from 'components/Logo'
import { SerializedSendInfo } from 'state/multisend/types'
// import { CryptoFormView, DataType } from 'views/Airdrop/types'
import { useAccount } from 'wagmi'
// import { getMultiSenderAddress } from 'utils/addressHelpers'
import { usePollMultisenderWithUserData, useMultisender } from 'state/multisend/hooks'
import { BASE_URL } from 'config'
// eslint-disable-next-line import/extensions
import CopyAddress from './CopyAddress'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'

import { filterDataByQuery } from '../filterDataByQuery'
import HistoryTable from './HistoryTable'
// eslint-disable-next-line import/extensions
import rot13 from '../../../utils/encode'


export function ReferralForm() {
  const { t } = useTranslation()
  // const chainId = useChainId()
  const { address: account } = useAccount()

  const { data: sendInfo } = useMultisender()

  usePollMultisenderWithUserData()

  const { query: urlQuery } = useRouter()

  const [_query, setQuery] = useState('')
  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query

  const bondsList = useCallback(
    (bondsToQuery: SerializedSendInfo[]): SerializedSendInfo[] => {
      return filterDataByQuery(bondsToQuery, query)
    },
    [query],
  )

  const activeData = bondsList(sendInfo)
  const referlink = account ? `${BASE_URL}/?ref=${rot13(account)}` : `${BASE_URL}/?ref=`

  return (
    <Box p="4px" position="inherit">
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', fontSize: 'x-large', color: 'white' }}>
        <h1>Your Referral</h1>
      </div>
      <FormContainer>
        <Box>
          <Flex width="100%" my="10px" justifyContent="space-between">
            <Box />
          </Flex>
          <Flex flexDirection="row" justifyContent="center">
            <Text color="primary" fontSize="20px" style={{ display: 'flex', alignItems: 'center' }}>{t('Referral Link : ')}</Text>
            &nbsp; &nbsp;
            <CopyAddress account={referlink} mt="5px" style={{ width: "70%" }} color="textSubtle" />
          </Flex>
          <Text>{t("If your referrer deposit to pools, you will get 50% of our deposit fee as referral reward. Please refer your friends, family and earn together.")}</Text>
          {account && activeData.length > 0 && <HistoryTable data={activeData} />}
          {activeData.length === 0 && <Flex justifyContent="center">
            {/* <Text>{t("You don't have any history.")}</Text> */}
          </Flex>}
        </Box>
      </FormContainer>
    </Box>
  )
}
