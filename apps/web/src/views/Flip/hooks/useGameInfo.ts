import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { useTranslation } from '@pancakeswap/localization'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useWeb3React } from '@pancakeswap/wagmi'

export function useGameInfo(
  typedValue: string,
  currency: Currency | undefined,
): {
  currency: Currency
  currencyBalance: CurrencyAmount<Currency>
  parsedAmount: CurrencyAmount<Currency> | undefined
  inputError?: string
} {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    currency ?? undefined,
  ])

  const parsedAmount = tryParseAmount(typedValue, currency ?? undefined)

  const currencyBalance = relevantTokenBalances[0]

  let inputError: string | undefined
  if (!account) {
    inputError = t('Connect Wallet')
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount')
  }

  if (currencyBalance && currencyBalance.lessThan(parsedAmount?? 0)) {
    inputError = t('Insufficient %symbol% balance', { symbol: currencyBalance.currency.symbol })
  }

  return {
    currency,
    currencyBalance,
    parsedAmount,
    inputError,
  }
}
