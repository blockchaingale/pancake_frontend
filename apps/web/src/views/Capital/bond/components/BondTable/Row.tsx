import { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import {
  Flex,
  useMatchBreakpoints,
  Skeleton,
  Farm as FarmUI,
  Text,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
// import { useFarmUser } from 'state/farms/hooks'
import { useDelayedUnmount } from '@pancakeswap/hooks'
import { SerializedBond } from '@pancakeswap/capital'

import Bond from './Bond'
import ActionPanel from './Actions/ActionPanel'
import Details from './Details'
// import Earned from './Earned'

// const { FarmAuctionTag, CoreTag } = FarmUI.Tags
const { CellLayout } = FarmUI.FarmTable

export interface RowProps {
  bond: SerializedBond
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean
}

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 32px;
  }
`

const StyledTr = styled.tr`
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`

const FarmMobileCell = styled.td`
  padding-top: 24px;
`

type ColumnsDefTypes = {
  id: number;
  label: string;
  name: string;
  sortable: boolean;
};

export const DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: "bond",
    sortable: true,
    label: "",
  },
  {
    id: 2,
    name: "type",
    sortable: false,
    label: "",
  },
  {
    id: 3,
    name: "price",
    sortable: true,
    label: "Price",
  },
  {
    id: 4,
    name: "roi",
    sortable: true,
    label: "ROI",
  },
  {
    id: 5,
    name: "earned",
    sortable: true,
    label: "Pending Payout",
  },
  {
    id: 6,
    name: "purchased",
    sortable: true,
    label: "Purchased",
  },
  {
    id: 7,
    name: "details",
    sortable: true,
    label: "",
  },
];

const Row: React.FunctionComponent<React.PropsWithChildren<RowPropsWithLoading>> = (props) => {
  const [actionPanelExpanded, setActionPanelExpanded] = useState(false)
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300)
  const { t } = useTranslation()

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded)
  }

  const { isMobile } = useMatchBreakpoints()

  const handleRenderRow = () => {
    if (!isMobile) {
      return (
        <StyledTr onClick={toggleActionPanel}>
          {DesktopColumnSchema.map((row) => {
            const key = row.name
            switch (key) {
              case 'bond':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        <Bond bond={props?.bond} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'details':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        <Details actionPanelToggled={actionPanelExpanded} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'earned':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('Pending Bond')}>
                        <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                          {props?.bond?.userData?.pendingPayout ? (
                            `${new BigNumber(props?.bond?.userData?.pendingPayout).toFixed(2, BigNumber.ROUND_DOWN)} DCP`
                          ) : (
                            <Skeleton height={24} width={80} />
                          )}
                        </Text>
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'price':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('Bond Price')}>
                        <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                          {props?.bond?.bondPriceInUSD ? (
                            `${props?.bond?.bondPriceInUSD} USD`
                          ) : (
                            <Skeleton height={24} width={80} />
                          )}
                        </Text>
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'roi':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('ROI')}>
                        <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                          {props?.bond?.discount ? (
                            `${new BigNumber(props?.bond?.discount).times(100).toFixed(2)} %`
                          ) : (
                            <Skeleton height={24} width={80} />
                          )}
                        </Text>
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'purchased':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('Purchased')}>
                        <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                          {props?.bond?.purchased ? (
                            `${props?.bond?.purchased} USD`
                          ) : (
                            <Skeleton height={24} width={80} />
                          )}
                        </Text>
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              default: 
                return <td key={key}><Skeleton height={24} width={80} /></td>
            }
          })}
        </StyledTr>
      )
    }

    return (
      <>
        <tr style={{ cursor: 'pointer' }} onClick={toggleActionPanel}>
          <FarmMobileCell colSpan={3}>
            <Flex justifyContent="space-between" alignItems="center">
              <Bond bond={props?.bond} />
            </Flex>
          </FarmMobileCell>
        </tr>
        <StyledTr onClick={toggleActionPanel}>
          <td width="33%">
            <EarnedMobileCell>
              <CellLayout label={t('Bond Price')}>
                <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                  {props?.bond?.bondPriceInUSD ? (
                    `${props?.bond?.bondPriceInUSD} USD`
                  ) : (
                    <Skeleton height={24} width={80} />
                  )}
                </Text>
              </CellLayout>
            </EarnedMobileCell>
          </td>
          <td width="33%">
            <EarnedMobileCell>
              <CellLayout label={t('Pending Bond')}>
                <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                  {props?.bond?.userData?.pendingPayout ? (
                    `${new BigNumber(props?.bond?.userData?.pendingPayout).toFixed(2, BigNumber.ROUND_DOWN)} DCP`
                  ) : (
                    <Skeleton height={24} width={80} />
                  )}
                </Text>
              </CellLayout>
            </EarnedMobileCell>
          </td>
          <td width="33%">
            <CellInner style={{ justifyContent: 'flex-end' }}>
              <Details actionPanelToggled={actionPanelExpanded} />
            </CellInner>
          </td>
        </StyledTr>
      </>
    )
  }

  return (
    <>
      {handleRenderRow()}
      {shouldRenderChild && (
        <tr>
          <td colSpan={7}>
            <ActionPanel {...props} expanded={actionPanelExpanded} />
          </td>
        </tr>
      )}
    </>
  )
}

export default Row
