import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_TEN, BIG_TWO, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { BondConfigBaseProps, SerializedBond, SerializedBondCalcPublicData, SerializedBondPublicData } from '@pancakeswap/capital'
import { fetchPublicBondData, fetcBondCalcData } from './fetchPublicBondData'

function bondTransformer(marketPrice: BigNumber, bondResult: any[]) {
  return (bond, index) => {
    const [
      treasuryBalance,
      terms,
      maxBondPrice,
      bondPrice,
      bondPriceInUSD,
    ] = bondResult[index]

    const bondPriceInUSDBN = new BigNumber(bondPriceInUSD)
    const discount = marketPrice.times(BIG_TEN.pow(bond.bondToken.decimals)).minus(bondPriceInUSDBN).div(bondPriceInUSDBN)

    return {
      ...bond,
      discount: discount.toJSON(),
      purchased: new BigNumber(treasuryBalance[0]._hex).toJSON(),
      vestingTerms: terms.vestingTerm,
      marketPrice: marketPrice.toJSON(),
      maxBondPrice: new BigNumber(maxBondPrice[0]._hex).toJSON(),
      bondPrice: new BigNumber(bondPrice[0]._hex).toJSON(),
      bondPriceInUSD: new BigNumber(bondPriceInUSD[0]._hex).div(BIG_TEN.pow(bond.bondToken.decimals)).toJSON(),
      lpPrice: BIG_ONE.toJSON()
    }
  }
}

function bondCalcTransformer(bondResult: any[]) {
  return (bond, index) => {
    const [
      totalLpValue,
      totalLpSupply,
      markdown,
      valuation,
    ] = bondResult[index]

    const markdownBN = new BigNumber(markdown)
    const valuationBN = new BigNumber(valuation)

    const purchased = markdownBN.times(valuationBN).div(BIG_TEN.pow(9))
    const lpPrice = bond.purchased ? purchased.div(new BigNumber(bond.purchased)) : BIG_ZERO

    return {
      ...bond,
      purchased: purchased.toJSON(),
      lpPrice: lpPrice.toJSON(),
      totalLpValue,
      totalLpSupply,
    }
  }
}

const bondCalculate = (bondsPublicData: SerializedBondPublicData[], lpBondsPublicData: SerializedBondCalcPublicData[]) : SerializedBond[] => {
  return bondsPublicData.map((bond) => {
    if (!bond.lpBond) {
      return {
        ...bond,
        totalLpValue: BIG_ZERO.toJSON(),
        totalLpSupply: BIG_ZERO.toJSON(),
      }
    }
    return {
      ...bond,
      purchased: lpBondsPublicData.find((lpBond) => bond.bondAddress === lpBond.bondAddress).purchased,
      totalLpValue: lpBondsPublicData.find((lpBond) => bond.bondAddress === lpBond.bondAddress).totalLpValue,
      totalLpSupply: lpBondsPublicData.find((lpBond) => bond.bondAddress === lpBond.bondAddress).totalLpSupply,
    }
  })
}

const fetchBonds = async (marketPrice: BigNumber, bondsToFetch: BondConfigBaseProps[], chainId: number): Promise<SerializedBond[]> => {

  const [BondsResult] = await Promise.all([
    fetchPublicBondData(bondsToFetch, chainId)
  ])

  const bondsPublicData = bondsToFetch.map(bondTransformer(marketPrice, BondsResult));
  const lpBondsToFetch = bondsPublicData.filter((bond) => bond.lpBond)

  const [BondsCalcResult] = await Promise.all([
    fetcBondCalcData(lpBondsToFetch, chainId)
  ])

  const lpBondsPublicData = lpBondsToFetch.map(bondCalcTransformer(BondsCalcResult));

  return bondCalculate(bondsPublicData, lpBondsPublicData)
}

export default fetchBonds
