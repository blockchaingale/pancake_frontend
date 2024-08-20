import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
// import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Box, Flex, SearchInput } from '@pancakeswap/uikit'
// import { Currency } from '@pancakeswap/sdk'
// import { MMTOKEN, arbitrumTokens } from '@pancakeswap/tokens'
import { useRouter } from 'next/router'
// import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
// import Row from 'components/Layout/Row'
// import { CurrencyLogo } from 'components/Logo'
import { SerializedSendInfo } from 'state/multisend/types'
// import { CryptoFormView, DataType } from 'views/Airdrop/types'
import { useAccount, useChainId } from 'wagmi'
// import { getMultiSenderAddress } from 'utils/addressHelpers'
import { usePollMultisenderWithUserData, useMultisender } from 'state/multisend/hooks'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'
// import DataTable from './DataTable'
// import SendCommitButton from './SendCommitButton'
// import { useAccountInfo } from '../hooks/useAccountInfo'
import { filterDataByQuery } from '../filterDataByQuery'
import HistoryTable from './HistoryTable'

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

export function HistoryForm() {
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

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Your history')} subTitle={t('')} />
      <FormContainer>
        <Box>
          <Flex width="100%" my="10px" justifyContent="space-between">
            <Box />
            <FilterContainer>
              <LabelWrapper style={{ marginLeft: 16 }}>
                <SearchInput initialValue={normalizedUrlSearch} onChange={handleChangeQuery} placeholder="Search Tag" />
              </LabelWrapper>
            </FilterContainer>
          </Flex>
          {account && activeData.length > 0 && <HistoryTable data={activeData} />}
          {activeData.length === 0 && <Flex justifyContent="center">
            <Text>{t("You don't have any history.")}</Text>
          </Flex>}
        </Box>
      </FormContainer>
    </Box>
  )
}
