import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, NATIVE, Percent } from '@pancakeswap/sdk'
import {
  ArrowDownIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  Message,
  MessageText,
  Skeleton,
  Swap as SwapUI,
  Text,
  useModal
} from '@pancakeswap/uikit'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useStableSwapByDefault } from 'state/user/smartRouter'
import { maxAmountSpend } from 'utils/maxAmountSpend'
// import AccessRisk from 'views/Swap/components/AccessRisk'

import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow } from 'components/Layout/Row'
import { CommonBasesType } from 'components/SearchModal/types'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { useAtomValue } from 'jotai'
import { Field } from 'state/swap/actions'
import { useDerivedSwapInfo, useSwapState } from 'state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from 'state/user/hooks'
import { currencyId } from 'utils/currencyId'
import Cookies from 'universal-cookie';
import { useQueryParam, StringParam } from 'use-query-params';
import rot13 from 'utils/encode'
import { isAddress } from '../../../utils'
import { combinedTokenMapFromOfficialsUrlsAtom } from '../../../state/lists/hooks'
import AddressInputPanel from '../components/AddressInputPanel'
import AdvancedSwapDetailsDropdown from '../components/AdvancedSwapDetailsDropdown'
import CurrencyInputHeader from '../components/CurrencyInputHeader'
import { ArrowWrapper, Wrapper } from '../components/styleds'
import SwapCommitButton from '../components/SwapCommitButton'
import useRefreshBlockNumberID from '../hooks/useRefreshBlockNumber'
import useWarningImport from '../hooks/useWarningImport'
import { SwapFeaturesContext } from '../SwapFeaturesContext'
import SmartSwapCommitButton from './components/SmartSwapCommitButton'
import { useDerivedSwapInfoWithStableSwap, useIsSmartRouterBetter, useTradeInfo } from './hooks'
import SettingsModal from '../../../components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'
// eslint-disable-next-line import/order
import styled from 'styled-components'
// eslint-disable-next-line import/newline-after-import
import { useCurrencyBalance } from '../../../state/wallet/hooks'


export const SmartSwapForm: React.FC<{ handleOutputSelect: (newCurrencyOutput: Currency) => void }> = ({
  handleOutputSelect,
}) => {
  const { isAccessTokenSupported } = useContext(SwapFeaturesContext)
  const { t } = useTranslation()
  
  const cookies = new Cookies();
  const [ref] = useQueryParam('ref', StringParam);
  if(ref) {
    if(isAddress(rot13(ref))) {
      cookies.set("ref", ref)
    }
  }
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  const warningSwapHandler = useWarningImport()
  const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom)

  const { account, chainId } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  const [allowUseSmartRouter, setAllowUseSmartRouter] = useState(() => false)

  // swap state & price data

  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency],
  )
  const [isStableSwapByDefault] = useStableSwapByDefault()

  const { v2Trade, inputError: swapInputError } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrency,
    outputCurrency,
    recipient,
  )
  const {
    trade: tradeWithStableSwap,
    currencyBalances,
    parsedAmount,
    inputError: stableSwapInputError,
  } = useDerivedSwapInfoWithStableSwap(independentField, typedValue, inputCurrency, outputCurrency, recipient)

  const isSmartRouterBetter = useIsSmartRouterBetter({ trade: tradeWithStableSwap, v2Trade })

  const tradeInfo = useTradeInfo({
    trade: tradeWithStableSwap,
    v2Trade,
    useSmartRouter: (allowUseSmartRouter || isStableSwapByDefault) && isSmartRouterBetter,
    allowedSlippage,
    chainId,
    swapInputError,
    stableSwapInputError,
  })

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const parsedAmounts = showWrap
    ? {
      [Field.INPUT]: parsedAmount,
      [Field.OUTPUT]: parsedAmount,
    }
    : {
      [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : tradeInfo?.inputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : tradeInfo?.outputAmount,
    }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const amountToApprove = tradeInfo?.slippageAdjustedAmounts[Field.INPUT]
  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(amountToApprove, tradeInfo?.routerAddress)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  const handleInputSelect = useCallback(
    (newCurrencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, newCurrencyInput)

      warningSwapHandler(newCurrencyInput)

      const newCurrencyInputId = currencyId(newCurrencyInput)
      if (newCurrencyInputId === outputCurrencyId) {
        replaceBrowserHistory('outputCurrency', inputCurrencyId)
      }
      replaceBrowserHistory('inputCurrency', newCurrencyInputId)
    },
    [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handlePercentInput = useCallback(
    (percent) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])

  const smartRouterOn = !!tradeInfo && !tradeInfo.fallbackV2

  // Switch from exact out to exact in if smart router trade is better and user already allowed to use smart swap
  useEffect(() => {
    if (smartRouterOn && independentField === Field.OUTPUT && v2Trade) {
      onUserInput(Field.INPUT, v2Trade.inputAmount.toSignificant(6))
    }
  }, [smartRouterOn, independentField, onUserInput, v2Trade])

  useEffect(() => {
    // Reset approval submit state after switch between old router and new router
    setApprovalSubmitted(false)
  }, [smartRouterOn])

  const onUseSmartRouterChecked = useCallback(() => setAllowUseSmartRouter(!allowUseSmartRouter), [allowUseSmartRouter])

  const allowRecipient = isExpertMode && !showWrap && !smartRouterOn

  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)
  const InputRow = styled.div<{ selected: boolean }>`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-end;
    padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
  `
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currencies[Field.INPUT] ?? undefined)
  const [currentClickedPercent, setCurrentClickedPercent] = useState('')
  const percentAmount = useMemo(
    () => ({
      25: maxAmountInput ? maxAmountInput.multiply(new Percent(25, 100)).toExact() : undefined,
      50: maxAmountInput ? maxAmountInput.multiply(new Percent(50, 100)).toExact() : undefined,
      75: maxAmountInput ? maxAmountInput.multiply(new Percent(75, 100)).toExact() : undefined,
    }),
    [maxAmountInput],
  )
  const isAtPercentMax = (maxAmountInput && formattedAmounts[Field.INPUT] === maxAmountInput.toExact())
  return (
    <>
      <CurrencyInputHeader
        title={t('Swap')}
        // subtitle={t('Trade tokens in an instant')}
        hasAmount={hasAmount}
        onRefreshPrice={onRefreshPrice}
      />
      <Wrapper id="swap-page" style={{ minHeight: '412px', padding: '2rem' }}>
        <AutoColumn gap="sm">
          <CurrencyInputPanel
            label={independentField === Field.OUTPUT && !showWrap && tradeInfo ? t('From (estimated)') : t('From')}
            value={formattedAmounts[Field.INPUT]}
            showMaxButton
            maxAmount={maxAmountInput}
            showQuickInputButton
            currency={currencies[Field.INPUT]}
            onUserInput={handleTypeInput}
            onPercentInput={handlePercentInput}
            onMax={handleMaxInput}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            id="swap-currency-input"
            showCommonBases
            showBUSD={!!tokenMap[chainId]?.[inputCurrencyId] || inputCurrencyId === NATIVE[chainId]?.symbol}
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
          />

          {/* {isAccessTokenSupported && inputCurrency?.isToken && (
            <Box>
              <AccessRisk token={inputCurrency} />
            </Box>
          )} */}

          <InputRow selected={false} style={{ padding: '10px 0px 0px 0px' }}>
            {account && currencies[Field.INPUT] && selectedCurrencyBalance?.greaterThan(0) && (
              <Flex alignItems="right" justifyContent="center" width="100%">
                {maxAmountInput?.greaterThan(0) &&
                  handlePercentInput &&
                  [25, 50, 75].map((percent) => {
                    const isAtClickedPercent = currentClickedPercent === percent.toString()
                    const isAtCurrentPercent =
                      (maxAmountInput && formattedAmounts[Field.INPUT] !== '0' && formattedAmounts[Field.INPUT] === percentAmount[percent])

                    return (
                      <Button
                        key={`btn_quickCurrency${percent}`}
                        onClick={() => {
                          handlePercentInput(percent)
                          setCurrentClickedPercent(percent.toString())
                        }}
                        scale="xs"
                        mr="5px"
                        variant={isAtClickedPercent || isAtCurrentPercent ? 'primary' : 'secondary'}
                        style={{ textTransform: 'uppercase', width: '25%', height: '30px' }}
                      >
                        {percent}%
                      </Button>
                    )
                  })}
                {maxAmountInput?.greaterThan(0) && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      handleMaxInput?.()
                      setCurrentClickedPercent('MAX')
                    }}
                    scale="xs"
                    variant={isAtPercentMax ? 'primary' : 'secondary'}
                    style={{ textTransform: 'uppercase', width: '25%', height: '30px' }}
                  >
                    {t('Max')}
                  </Button>
                )}
              </Flex>
            )}
          </InputRow>

          <AutoColumn justify="space-between">
            <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
              <SwapUI.SwitchButton
                onClick={() => {
                  setApprovalSubmitted(false) // reset 2 step UI for approvals
                  onSwitchTokens()
                  replaceBrowserHistory('inputCurrency', outputCurrencyId)
                  replaceBrowserHistory('outputCurrency', inputCurrencyId)
                }}
              />
              {allowRecipient && recipient === null ? (
                <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                  {t('+ Add a send (optional)')}
                </Button>
              ) : null}
            </AutoRow>
          </AutoColumn>
          <CurrencyInputPanel
            value={formattedAmounts[Field.OUTPUT]}
            onUserInput={handleTypeOutput}
            label={independentField === Field.INPUT && !showWrap && tradeInfo ? t('To (estimated)') : t('To')}
            showMaxButton={false}
            currency={currencies[Field.OUTPUT]}
            onCurrencySelect={handleOutputSelect}
            otherCurrency={currencies[Field.INPUT]}
            id="swap-currency-output"
            showCommonBases
            disabled={smartRouterOn}
            showBUSD={!!tokenMap[chainId]?.[outputCurrencyId] || outputCurrencyId === NATIVE[chainId]?.symbol}
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
          />

          {/* {isAccessTokenSupported && outputCurrency?.isToken && (
            <Box>
              <AccessRisk token={outputCurrency} />
            </Box>
          )} */}

          {isSmartRouterBetter && !isStableSwapByDefault && (
            <AutoColumn>
              {allowUseSmartRouter && (
                <Message variant="warning" mb="8px">
                  <MessageText>{t('This route includes StableSwap and can’t edit output')}</MessageText>
                </Message>
              )}
              <Flex alignItems="center" onClick={onUseSmartRouterChecked}>
                <Checkbox
                  scale="sm"
                  name="allowUseSmartRouter"
                  type="checkbox"
                  checked={allowUseSmartRouter}
                  onChange={onUseSmartRouterChecked}
                />
                <Text ml="8px" style={{ userSelect: 'none' }}>
                  {t('Use StableSwap for better fees')}
                </Text>
              </Flex>
            </AutoColumn>
          )}

          {allowRecipient && recipient !== null ? (
            <>
              <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                <ArrowWrapper clickable={false}>
                  <ArrowDownIcon width="16px" />
                </ArrowWrapper>
                <Button variant="text" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                  {t('- Remove send')}
                </Button>
              </AutoRow>
              <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
            </>
          ) : null}

          {showWrap ? null : (
            <SwapUI.Info
              price={
                Boolean(tradeInfo) && (
                  <>
                    <SwapUI.InfoLabel>{t('Price')}</SwapUI.InfoLabel>
                    {isLoading ? (
                      <Skeleton width="100%" ml="8px" height="24px" />
                    ) : (
                      <SwapUI.TradePrice price={tradeInfo?.executionPrice} />
                    )}
                  </>
                )
              }
              allowedSlippage={allowedSlippage}
              onSlippageClick={onPresentSettingsModal}
            />
          )}
          {!swapIsUnsupported ? (
            !showWrap &&
            tradeInfo && (
              <AdvancedSwapDetailsDropdown
                hasStablePair={smartRouterOn}
                pairs={tradeInfo.route.pairs}
                path={tradeInfo.route.path}
                priceImpactWithoutFee={tradeInfo.priceImpactWithoutFee}
                realizedLPFee={tradeInfo.realizedLPFee}
                slippageAdjustedAmounts={tradeInfo.slippageAdjustedAmounts}
                inputAmount={tradeInfo.inputAmount}
                outputAmount={tradeInfo.outputAmount}
                tradeType={tradeInfo.tradeType}
              />
            )
          ) : (
            <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
          )}
        </AutoColumn>

        <Box mt="0.25rem">
          {tradeInfo?.fallbackV2 ? (
            <SwapCommitButton
              swapIsUnsupported={swapIsUnsupported}
              account={account}
              showWrap={showWrap}
              wrapInputError={wrapInputError}
              onWrap={onWrap}
              wrapType={wrapType}
              parsedIndepentFieldAmount={parsedAmounts[independentField]}
              approval={approval}
              approveCallback={approveCallback}
              approvalSubmitted={approvalSubmitted}
              currencies={currencies}
              isExpertMode={isExpertMode}
              trade={v2Trade}
              swapInputError={tradeInfo.inputError}
              currencyBalances={currencyBalances}
              recipient={recipient}
              allowedSlippage={allowedSlippage}
              onUserInput={onUserInput}
            />
          ) : (
            <SmartSwapCommitButton
              swapIsUnsupported={swapIsUnsupported}
              account={account}
              showWrap={showWrap}
              wrapInputError={wrapInputError}
              onWrap={onWrap}
              wrapType={wrapType}
              parsedIndepentFieldAmount={parsedAmounts[independentField]}
              approval={approval}
              approveCallback={approveCallback}
              approvalSubmitted={approvalSubmitted}
              currencies={currencies}
              isExpertMode={isExpertMode}
              trade={tradeWithStableSwap}
              swapInputError={swapInputError}
              currencyBalances={currencyBalances}
              recipient={recipient}
              allowedSlippage={allowedSlippage}
              onUserInput={onUserInput}
            />
          )}
        </Box>
      </Wrapper>
    </>
  )
}
