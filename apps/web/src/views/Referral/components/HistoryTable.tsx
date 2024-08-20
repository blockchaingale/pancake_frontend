import BigNumber from "bignumber.js";
import { useTranslation } from "@pancakeswap/localization";
import { ArrowBackIcon, ArrowForwardIcon, Flex, Text } from "@pancakeswap/uikit";
import { Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { SerializedSendInfo } from "state/multisend/types";
import { CurrencyLogo } from "components/Logo";
import useNativeCurrency from "hooks/useNativeCurrency";
import { useCurrency } from "hooks/Tokens";
import { ZERO_ADDRESS } from "config/constants";
// import { DataType } from "../types";


const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 0.5em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 40px 1fr repeat(4, 1fr);

  @media screen and (max-width: 670px) {
    grid-template-columns: 20px 1fr repeat(1, 1fr);
    & :nth-child(3) {
      display: none;
    }
    & :nth-child(4) {
      display: none;
    }
    & :nth-child(5) {
      display: none;
    }
  }
`

const TableWrapper = styled(Flex)`
  width: 100%;
  padding-top: 16px;
  flex-direction: column;
  gap: 16px;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: 8px;
  }
`

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

function formatUnixTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

const DataRow: React.FC<React.PropsWithChildren<{ data: SerializedSendInfo; index: number }>> = ({ data, index }) => {
  const native = useNativeCurrency()
  const token = useCurrency(data.token)
  const currency = data.token === ZERO_ADDRESS ? native : token
  // const accountEllipsis = data.token ? `${data.token.substring(0, 6)}...${data.token.substring(data.token.length - 4)}` : null;
  return (
    <ResponsiveGrid>
      <Flex>
        <Text>{index + 1}</Text>
      </Flex>
      <Flex alignItems="center">
        <CurrencyLogo size="20px" currency={currency} />
        <Text fontSize="16px" ml="8px">{currency.symbol}</Text>
      </Flex>
      <Text fontWeight={400}>{data.receivers}</Text>
      <Text fontWeight={400}>{new BigNumber(data.amount).div(10 ** currency.decimals).toJSON()}</Text>
      <Text fontWeight={400}>{formatUnixTimestamp(Number(data.timestamp))}</Text>
      <Text fontWeight={400}>{data.tag}</Text>
    </ResponsiveGrid>
  )
}

const MAX_ITEMS = 10

const HistoryTable: React.FC<
  React.PropsWithChildren<{
    data: SerializedSendInfo[]
    maxItems?: number
  }>
> = ({ data, maxItems = MAX_ITEMS }) => {
  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  useEffect(() => {
    let extraPages = 1
    if (data) {
      if (data.length % maxItems === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(data.length / maxItems) + extraPages)
    }
  }, [maxItems, data])

  const sortedData = useMemo(() => {
    return data
      ? data.slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [data, maxItems, page])

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold>
          #
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          {t("Token")}
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          {t("Receivers")}
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          {t("Amount")}
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          {t("Time")}
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          {t("Tag")}
        </Text>
      </ResponsiveGrid>

      {sortedData.map((row, i) => {
        if (row) {
          return (
            <Fragment key={row.timestamp}>
              <DataRow data={row} index={(page - 1) * MAX_ITEMS + i} />
            </Fragment>
          )
        }
        return null
      })}
      <PageButtons>
        <Arrow
          onClick={() => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
        </Arrow>
        <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
        <Arrow
          onClick={() => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
        </Arrow>
      </PageButtons>
    </TableWrapper>
  )
}

export default HistoryTable