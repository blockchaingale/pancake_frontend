import { ChainId, JSBI, Percent, Token, WNATIVE } from '@pancakeswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { bscTokens, USDC, USDT, WBTC_ETH, DAI_ETH, WBTC_ARB, DAI_ARB, MMTOKEN, arbitrumTokens, WBTC_POLYGON, DAI_POLYGON} from '@pancakeswap/tokens'
import { ChainMap, ChainTokenList } from './types'

export const ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [ChainId.ARBITRUM]: '0x1050b026A1F1d38F64eBd73eE5cAb2235DDEA227',
  [ChainId.BSC]: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
  [ChainId.POLYGON]: '0x1050b026A1F1d38F64eBd73eE5cAb2235DDEA227',
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.ARBITRUM]: [WNATIVE[ChainId.ARBITRUM], USDC[ChainId.ARBITRUM], USDT[ChainId.ARBITRUM], WBTC_ARB],
  [ChainId.POLYGON]: [WNATIVE[ChainId.POLYGON], USDC[ChainId.POLYGON], USDT[ChainId.POLYGON], WBTC_POLYGON],
  [ChainId.BSC]: [
    bscTokens.wbnb,
    bscTokens.cake,
    bscTokens.busd,
    bscTokens.usdt,
    bscTokens.btcb,
    bscTokens.eth,
    bscTokens.usdc,
  ],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC]: {
    // SNFTS-SFUND
    [bscTokens.snfts.address]: [bscTokens.sfund],
  },
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH, DAI_ETH],
  [ChainId.POLYGON]: [WNATIVE[ChainId.POLYGON], USDC[ChainId.POLYGON], USDT[ChainId.POLYGON], WBTC_POLYGON, DAI_POLYGON],
  [ChainId.ARBITRUM]: [WNATIVE[ChainId.ARBITRUM], arbitrumTokens.arb, arbitrumTokens.dcp, DAI_ARB, USDC[ChainId.ARBITRUM], USDT[ChainId.ARBITRUM], WBTC_ARB],
  [ChainId.BSC]: [WNATIVE[ChainId.BSC], MMTOKEN[ChainId.BSC], bscTokens.usdt, bscTokens.usdc, bscTokens.dai, bscTokens.eth, bscTokens.btcb, bscTokens.cake],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.POLYGON]: [USDC[ChainId.POLYGON], WNATIVE[ChainId.POLYGON], USDT[ChainId.POLYGON], WBTC_POLYGON],
  [ChainId.ARBITRUM]: [USDC[ChainId.ARBITRUM], WNATIVE[ChainId.ARBITRUM], USDT[ChainId.ARBITRUM], WBTC_ARB],
  [ChainId.BSC]: [bscTokens.wbnb, bscTokens.dai, bscTokens.busd, bscTokens.usdt, bscTokens.cake],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.ETHEREUM]: [
    [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]],
    [WBTC_ETH, WNATIVE[ChainId.ETHEREUM]],
    [WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  ],
  [ChainId.POLYGON]: [
    [WNATIVE[ChainId.POLYGON], USDC[ChainId.POLYGON]],
    [WBTC_POLYGON, WNATIVE[ChainId.POLYGON]],
    [WNATIVE[ChainId.POLYGON], USDT[ChainId.POLYGON]],
  ],
  [ChainId.ARBITRUM]: [
    [WNATIVE[ChainId.ARBITRUM], USDC[ChainId.ARBITRUM]],
    [WBTC_ARB, WNATIVE[ChainId.ARBITRUM]],
    [WNATIVE[ChainId.ARBITRUM], USDT[ChainId.ARBITRUM]],
  ],
  [ChainId.BSC]: [
    [bscTokens.cake, bscTokens.wbnb],
    [bscTokens.busd, bscTokens.usdt],
    [bscTokens.dai, bscTokens.usdt],
  ],
}

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_TEN = JSBI.BigInt(10)

// one basis point
export const BIPS_BASE = JSBI.BigInt(10000)
export const ONE_BIPS = new Percent(JSBI.BigInt(1), BIPS_BASE)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: JSBI = JSBI.exponentiate(BIG_INT_TEN, JSBI.BigInt(16)) // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(JSBI.BigInt(25), BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

// BNB
export const DEFAULT_INPUT_CURRENCY = 'BNB'
// CAKE
export const DEFAULT_OUTPUT_CURRENCY = '0x8A8BD24B8718dDdD878F45Ff909a4A55B7E7Fb90'

// Handler string is passed to Gelato to use PCS router
export const GELATO_HANDLER = 'pancakeswap'
export const GENERIC_GAS_LIMIT_ORDER_EXECUTION = BigNumber.from(500000)

export const LIMIT_ORDERS_DOCS_URL = 'https://docs.pancakeswap.finance/products/pancakeswap-exchange/limit-orders'

export const EXCHANGE_PAGE_PATHS = ['/swap', '/limit-orders', 'liquidity', '/add', '/find', '/remove']
