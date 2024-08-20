/* eslint-disable import/order */
import { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import {
  Toggle,
  Text,
  // Button,
  // ArrowForwardIcon,
  Flex,
  Box,
  Farm as FarmUI,
  Loading,
  SearchInput,
  Select,
  OptionProps,
  FlexLayout,
  // PageHeader,
  // NextLinkFromReactRouter,
  ToggleView,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useFarms, usePollFarmsWithUserData, usePriceCakeBusd } from 'state/farms/hooks'
// import { useFarmsV1 as useFarms, usePollFarmsV1WithUserData as usePollFarmsWithUserData, usePriceCakeBusd } from 'state/farmsV1/hooks'
import { useCakeVaultUserData } from 'state/pools/hooks'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { DeserializedFarm, FarmWithStakedValue, filterFarmsByQuery } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { getFarmApr } from 'utils/apr'
import orderBy from 'lodash/orderBy'
import { useUserFarmStakedOnly, useUserFarmsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import Table from './components/FarmTable/FarmTable'
// import { BCakeBoosterCard } from './components/BCakeBoosterCard'
// import { FarmTypesFilter } from './components/FarmTypesFilter'
import { FarmsContext } from './context'
import { FormContainer } from 'views/CreateFairLaunch/components/FormContainer'


const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`
// const FarmFlexWrapper = styled(Flex)`
//   flex-wrap: wrap;
//   ${({ theme }) => theme.mediaQueries.md} {
//     flex-wrap: nowrap;
//   }
// `
// const FarmH1 = styled(Heading)`
//   font-size: 32px;
//   margin-bottom: 8px;
//   ${({ theme }) => theme.mediaQueries.sm} {
//     font-size: 64px;
//     margin-bottom: 24px;
//   }
// `
// const FarmH2 = styled(Heading)`
//   font-size: 16px;
//   margin-bottom: 8px;
//   ${({ theme }) => theme.mediaQueries.sm} {
//     font-size: 24px;
//     margin-bottom: 18px;
//   }
// `

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  ${Text} {
    margin-left: 8px;
  }
`

const TimeContents = styled.div`
  display: flex;
`

const TimeContent = styled.div`
  display: flex;
  padding : 10px;
  font-size:24px;
  color: white;
`

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

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

// const StyledImage = styled(Image)`
//   margin-left: auto;
//   margin-right: auto;
//   margin-top: 58px;
// `

// const FinishedTextContainer = styled(Flex)`
//   padding-bottom: 32px;
//   flex-direction: column;
//   ${({ theme }) => theme.mediaQueries.md} {
//     flex-direction: row;
//   }
// `

// const FinishedTextLink = styled(Link)`
//   font-weight: 400;
//   white-space: nowrap;
//   text-decoration: underline;
// `

const NUMBER_OF_FARMS_VISIBLE = 12

const Farms: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname, query: urlQuery } = useRouter()
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { data: farmsLP, userDataLoaded, poolLength, regularCakePerBlock } = useFarms()

  const cakePrice = usePriceCakeBusd()

  const [_query, setQuery] = useState('')
  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query

  const [viewMode, setViewMode] = useUserFarmsViewMode()
  const { address: account } = useAccount()
  const [sortOption, setSortOption] = useState('hot')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)

  const tokenMode = pathname.includes('pools')
  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  useCakeVaultUserData()

  usePollFarmsWithUserData()

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)
  const [boostedOnly, setBoostedOnly] = useState(false)
  const [stableSwapOnly, setStableSwapOnly] = useState(false)
  // const [farmTypesEnableCount, setFarmTypesEnableCount] = useState(0)

  // NOTE: Temporarily inactive aBNBc-BNB LP on FE
  const activeFarms = farmsLP.filter(
    (farm) =>
      // farm.lpAddress !== '0x272c2CF847A49215A3A1D4bFf8760E503A06f880' &&
      // farm.lpAddress !== '0xB6040A9F294477dDAdf5543a24E5463B8F2423Ae' &&
      // farm.pid !== 0 &&
      farm.multiplier !== '0X' &&
        // tokenMode ? farm.isTokenOnly : !farm.isTokenOnly &&
      (!poolLength || poolLength > farm.pid),
  )

  const inactiveFarms = farmsLP.filter(
    (farm) =>
      // farm.lpAddress === '0xB6040A9F294477dDAdf5543a24E5463B8F2423Ae' ||
      // farm.lpAddress === '0x272c2CF847A49215A3A1D4bFf8760E503A06f880' ||
      (farm.pid !== 0 && farm.multiplier === '0X'),
  )
  const archivedFarms = farmsLP

  const stakedOnlyFarms = activeFarms.filter(
    (farm) =>
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)),
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) =>
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)),
  )

  const stakedArchivedFarms = archivedFarms.filter(
    (farm) =>
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)),
  )

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }

        const totalLiquidity = farm.isTokenOnly ? new BigNumber(farm.lpTotalInQuoteToken).times(farm.tokenPriceBusd) : new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(
            chainId,
            new BigNumber(farm.poolWeight),
            cakePrice,
            totalLiquidity,
            farm.lpAddress,
            regularCakePerBlock,
          )
          : { cakeRewardsApr: 0, lpRewardsApr: 0 }

        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      return filterFarmsByQuery(farmsToDisplayWithAPR, query)
    },
    [query, isActive, chainId, cakePrice, regularCakePerBlock],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  const chosenFarms = useMemo(() => {
    let chosenFs = []
    if (isActive) {
      chosenFs = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFs = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFs = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    if (boostedOnly || stableSwapOnly) {
      const boostedOrStableSwapFarms = chosenFs.filter(
        (farm) => (boostedOnly && farm.boosted) || (stableSwapOnly && farm.isStable),
      )

      const stakedBoostedOrStableSwapFarms = chosenFs.filter(
        (farm) =>
          farm.userData &&
          (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
            new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)),
      )

      chosenFs = stakedOnly ? farmsList(stakedBoostedOrStableSwapFarms) : farmsList(boostedOrStableSwapFarms)
    }

    return chosenFs
  }, [
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    boostedOnly,
    stableSwapOnly,
  ])
  const chosenFarmsMemoized = useMemo(() => {
    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        case 'latest':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.pid), 'desc')
        default:
          return farms
      }
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [chosenFarms, sortOption, numberOfFarmsVisible])

  chosenFarmsLength.current = chosenFarmsMemoized.length

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return farmsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const providerValue = useMemo(() => ({ chosenFarmsMemoized }), [chosenFarmsMemoized])


  const [timers, setTimers] = useState(0);
  const getTime = async () => {
    let datas;
    let time;
    const StartTime = 1710587782;
    if ((Number(StartTime) * 1000) > Date.now()) {
      time = (Number(StartTime) * 1000) - Date.now();
    }
    // eslint-disable-next-line prefer-const
    datas = [Math.floor(time / (1000 * 60 * 60 * 24)), Math.floor((time / (1000 * 60 * 60)) % 24), Math.floor((time / 1000 / 60) % 60), Math.floor((time / 1000) % 60)]
    setTimers(datas);
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <FarmsContext.Provider value={providerValue}>

      <Page>
      <Box p="4px" position="inherit" background='#212529' borderRadius='10px'>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', fontSize: 'x-large', color: 'white' }}>
          <h1>Pool will start in :</h1>
        </div>
        <FormContainer>
          <Box>
            <Flex width="100%" my="10px" justifyContent="space-between">
              <Box />
            </Flex>
            <Flex flexDirection="row" justifyContent="space-evenly">
              {timers !== undefined ?
                <TimeContents>
                  <TimeContent>
                    <span>{timers[0]}</span>
                    &nbsp;
                    <p>Days</p>
                  </TimeContent>
                  <TimeContent>
                    <span>{timers[1]}</span>
                    &nbsp;
                    <p>Hours</p>
                  </TimeContent>
                  <TimeContent>
                    <span>{timers[2]}</span>
                    &nbsp;
                    <p>Mins</p>
                  </TimeContent>
                  <TimeContent>
                    <span>{timers[3]}</span>
                    &nbsp;
                    <p>Secs</p>
                  </TimeContent>
                </TimeContents>
                :
                <></>}

            </Flex>
          </Box>
        </FormContainer>
      </Box>
        <ControlContainer>
          <ViewControls>
            <Flex>
              <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={setViewMode} />
            </Flex>
            <FarmUI.FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} tokenMode={tokenMode} />
            <Flex ml="16px">
              <ToggleWrapper>
                <Toggle
                  id="staked-only-farms"
                  checked={stakedOnly}
                  onChange={() => setStakedOnly(!stakedOnly)}
                  scale="sm"
                />
                <Text color='#000'> {t('Staked only')}</Text>
              </ToggleWrapper>
            </Flex>
          </ViewControls>
          <FilterContainer>
            <LabelWrapper>
              <Select
                options={[
                  {
                    label: t('Hot'),
                    value: 'hot',
                  },
                  {
                    label: t('APR'),
                    value: 'apr',
                  },
                  {
                    label: t('Multiplier'),
                    value: 'multiplier',
                  },
                  {
                    label: t('Earned'),
                    value: 'earned',
                  },
                  {
                    label: t('Liquidity'),
                    value: 'liquidity',
                  },
                  {
                    label: t('Latest'),
                    value: 'latest',
                  },
                ]}
                onOptionChange={handleSortOptionChange}
              />
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <SearchInput initialValue={normalizedUrlSearch} onChange={handleChangeQuery} placeholder="Search Farms" />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        {viewMode === ViewMode.TABLE ? (
          <Table farms={chosenFarmsMemoized} cakePrice={cakePrice} userDataReady={userDataReady} />
        ) : (
          <FlexLayout>{children}</FlexLayout>
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center">
            <Loading />
          </Flex>
        )}
        {poolLength && <div ref={observerRef} />}

      </Page>
    </FarmsContext.Provider>
  )
}

export default Farms
