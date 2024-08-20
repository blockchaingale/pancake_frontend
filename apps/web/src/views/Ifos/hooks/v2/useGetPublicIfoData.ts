import BigNumber from 'bignumber.js'
import { useState, useCallback } from 'react'
import { BSC_BLOCK_TIME } from 'config'
import round from 'lodash/round'
import ifoV2Abi from 'config/abi/ifoV2.json'
import { bscTokens } from '@pancakeswap/tokens'
import { Ifo, IfoStatus } from 'config/constants/types'
import { FixedNumber } from '@ethersproject/bignumber'

import { useLpTokenPrice, usePriceCakeBusd } from 'state/farms/hooks'
import { BIG_ONE, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { multicallv2 } from 'utils/multicall'
import { PublicIfoData } from '../../types'
import { getStatus } from '../helpers'
// import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'

// https://github.com/pancakeswap/pancake-contracts/blob/master/projects/ifo/contracts/IFOV2.sol#L431
// 1,000,000,000 / 100
const TAX_PRECISION = FixedNumber.from(10000000000)

const formatPool = (pool) => ({
  raisingAmountPool: pool ? new BigNumber(pool[0].toString()) : BIG_ZERO,
  offeringAmountPool: pool ? new BigNumber(pool[1].toString()) : BIG_ZERO,
  limitPerUserInLP: pool ? new BigNumber(pool[2].toString()) : BIG_ZERO,
  hasTax: pool ? pool[3] : false,
  totalAmountPool: pool ? new BigNumber(pool[4].toString()) : BIG_ZERO,
  sumTaxesOverflow: pool ? new BigNumber(pool[5].toString()) : BIG_ZERO,
})

const ROUND_DIGIT = 3;

/**
 * Gets all public data of an IFO
 */
const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  const { address } = ifo
  // const cakePriceUsd = usePriceCakeBusd()
  // const lpTokenPriceInUsd = useLpTokenPrice(ifo.currency.symbol)
  // const currencyPriceInUSD = ifo.currency === bscTokens.cake ? cakePriceUsd : lpTokenPriceInUsd

  const [state, setState] = useState({
    isInitialized: false,
    status: 'idle' as IfoStatus,
    blocksRemaining: 0,
    secondsUntilStart: 0,
    progress: 5,
    secondsUntilEnd: 0,
    poolBasic: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInLP: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
    },
    poolUnlimited: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInLP: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
    },
    thresholdPoints: undefined,
    startBlockNum: 0,
    endBlockNum: 0,
    numberPoints: 0,
  })

  const fetchIfoData = useCallback(
    async (currentBlock: number) => {
      const [startBlock, endBlock, poolBasic, poolUnlimited, taxRate, numberPoints, thresholdPoints] =
        await multicallv2({
          abi: ifoV2Abi,
          calls: [
            {
              address,
              name: 'startTime',
            },
            {
              address,
              name: 'endTime',
            },
            {
              address,
              name: 'viewPoolInformation',
              params: [0],
            },
            {
              address,
              name: 'viewPoolInformation',
              params: [1],
            },
            {
              address,
              name: 'viewPoolTaxRateOverflow',
              params: [1],
            },
            {
              address,
              name: 'numberPoints',
            },
            {
              address,
              name: 'thresholdPoints',
            },
          ].filter(Boolean),
        })

      const poolBasicFormatted = formatPool(poolBasic)
      const poolUnlimitedFormatted = formatPool(poolUnlimited)

      const startBlockNum = startBlock ? startBlock[0].toNumber() : 0
      const endBlockNum = endBlock ? endBlock[0].toNumber() : 0
      const taxRateNum = taxRate ? FixedNumber.from(taxRate[0]).divUnsafe(TAX_PRECISION).toUnsafeFloat() : 0
      const status = getStatus(Math.floor(Date.now()/1000), startBlockNum, endBlockNum)
      const totalBlocks = endBlockNum - startBlockNum
      const blocksRemaining = endBlockNum - currentBlock

      // Calculate the total progress until finished or until start
      const progress = status === 'live' ? ((Math.floor(Date.now()/1000) - startBlockNum) / totalBlocks) * 100 : null

      const totalOfferingAmount = poolBasicFormatted.offeringAmountPool.plus(poolUnlimitedFormatted.offeringAmountPool)

      setState((prev) => ({
        ...prev,
        isInitialized: true,
        secondsUntilEnd: blocksRemaining * BSC_BLOCK_TIME,
        secondsUntilStart: (startBlockNum - currentBlock) * BSC_BLOCK_TIME,
        poolBasic: {
          ...poolBasicFormatted,
          taxRate: 0,
          distributionRatio: round(
            poolBasicFormatted.offeringAmountPool.div(totalOfferingAmount).toNumber(),
            ROUND_DIGIT,
          ),
        },
        poolUnlimited: {
          ...poolUnlimitedFormatted, 
          taxRate: taxRateNum,
          distributionRatio: round(
            poolUnlimitedFormatted.offeringAmountPool.div(totalOfferingAmount).toNumber(),
            ROUND_DIGIT,
          ),
        },
        status,
        progress,
        blocksRemaining,
        startBlockNum,
        endBlockNum,
        thresholdPoints: thresholdPoints && thresholdPoints[0],
        numberPoints: numberPoints ? numberPoints[0].toNumber() : 0,
      }))
    },
    [address],
  )

  return { ...state, currencyPriceInUSD: BIG_ONE, fetchIfoData }
}

export default useGetPublicIfoData
