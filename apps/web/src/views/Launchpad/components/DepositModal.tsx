import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import _toNumber from "lodash/toNumber";
import { useTranslation } from "@pancakeswap/localization";
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from "@pancakeswap/utils/formatBalance";
// import { getInterestBreakdown } from "@pancakeswap/utils/compoundApyHelpers";
import { BIG_TEN, BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import { trimTrailZero } from "@pancakeswap/utils/trimTrailZero";
import { 
  Modal, 
  ModalBody, 
  ModalActions, 
  ModalInput,
  Flex,
  Text,
  Button,
  AutoRenewIcon,
  LinkExternal,
  useToast,
  ModalInputForLaunchpad
} from "@pancakeswap/uikit";
import { SerializedLaunchpad } from "state/launchpad/types";
import { Currency, WNATIVE } from "@pancakeswap/sdk";
import useCatchTxError from "hooks/useCatchTxError";
import { ToastDescriptionWithTx } from "components/Toast";
import { useAppDispatch } from "state";
import { useERC20 } from "hooks/useContract";
import { fetchCapitalUserDataAsync } from "state/capital";
import { fetchLaunchpadPublicDataAsync, fetchLaunchpadUserDataAsync } from "state/launchpad";
import usePool from "../hooks/usePool";
import useApprovePool from "../hooks/useApprovePool";

const AnnualRoiDisplay = styled((props) => <Text {...props} />)`
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`;

interface DepositModalProps {
  chainId: number
  account: string
  pool: string
  data: SerializedLaunchpad
  token: Currency
  buyToken: Currency
  // addLiquidityUrl?: string
  // enablePendingTx?: boolean
  onDismiss?: () => void
  // onConfirm: (amount: string) => void
  // handleApprove?: () => void
}

const DepositModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  chainId,
  account,
  pool,
  data,
  token,
  buyToken,
  // addLiquidityUrl = "",
  // enablePendingTx,
  // onConfirm,
  onDismiss,
  // handleApprove
}) => {
  const { fetchWithCatchTxError, loading: enablePendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [val, setVal] = useState("0");
  const [valUSDPrice, setValUSDPrice] = useState(BIG_ZERO)
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    const max = data.maxBuy === 0 || data.maxBuy > data.userData.balance ? data.userData.balance : data.maxBuy
    return getFullDisplayBalance(new BigNumber(max), buyToken.decimals)
  }, [data, buyToken])

  const addLiquidityUrl = `/swap?outputCurrency=${buyToken.isNative ? buyToken.symbol : buyToken.wrapped.address}` 

  const needEnable = useMemo(() => {
    if (data.userData.allowance) {
      const amount = getDecimalAmount(new BigNumber(val), buyToken.decimals);
      return amount.gt(data.userData.allowance)
    }
    return true
  }, [data, val, buyToken])

  const lpTokensToStake = val ? new BigNumber(val) : BIG_ZERO
  const fullBalanceNumber = useMemo(() => new BigNumber(fullBalance), [fullBalance])

  const willGetValueBN = lpTokensToStake.times(data.rate).div(10**token.decimals)

  const formattedAnnualRoi = formatNumber(willGetValueBN.toNumber(), willGetValueBN.gt(10000) ? 0 : 2, willGetValueBN.gt(10000) ? 0 : 2)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        const inputVal = e.currentTarget.value.replace(/,/g, ".")
        setVal(inputVal);

        const USDPrice = inputVal === "" ? BIG_ZERO : new BigNumber(inputVal).times(data.rate)
        setValUSDPrice(USDPrice)
      }
    },
    [setVal, setValUSDPrice, data]
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)

    const USDPrice = new BigNumber(fullBalance).times(data.rate)
    setValUSDPrice(USDPrice);
  }, [fullBalance, setVal, setValUSDPrice, data])

  const handlePercentInput = useCallback(
    (percent: number) => {
      const totalAmount = fullBalanceNumber.dividedBy(100).multipliedBy(percent)
      const amount = trimTrailZero(totalAmount.toNumber().toFixed(buyToken.decimals))
      setVal(amount as string)

      const USDPrice = totalAmount.times(data.rate)
      setValUSDPrice(USDPrice)
    },
    [fullBalanceNumber, buyToken, data]
  )

  const { onDeposit } = usePool(pool, buyToken.isNative)
  const dispatch = useAppDispatch()

  const wnativeContract = useERC20(WNATIVE[chainId].address)
  const buyTokenContract = useERC20(buyToken.wrapped.address)

  const tokenContract = buyToken.isNative ? wnativeContract : buyTokenContract

  const { onApprove } = useApprovePool(tokenContract, pool)

  const onDone = useCallback(
    () => {
      dispatch(fetchLaunchpadPublicDataAsync({ address: pool, chainId }))
      dispatch(fetchLaunchpadUserDataAsync({ account, address: pool, chainId }))
    },
    [account, pool, chainId, dispatch],
  )

  const onConfirm = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => onDeposit(amount, buyToken.decimals))

    if (receipt?.status) {
      toastSuccess(
        `${t('Deposited')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have deposited %symbol%.', { symbol: buyToken.symbol })}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => onApprove())
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDone()
    }
  }, [onApprove, t, toastSuccess, fetchWithCatchTxError, onDone])

  return (
    <Modal title={t("Deposit %symbol%", {symbol: buyToken.symbol})} onDismiss={onDismiss}>
      <ModalBody width={["100%", "100%", "100%", "420px"]}>
        <ModalInputForLaunchpad
          value={val}
          // valueUSDPrice={valUSDPrice}
          onSelectMax={handleSelectMax}
          onPercentInput={handlePercentInput}
          onChange={handleChange}
          max={fullBalance}
          maxAmount={fullBalanceNumber}
          symbol={buyToken.symbol}
          addLiquidityUrl={addLiquidityUrl}
          inputTitle={t("Deposit %symbol%", {symbol: buyToken.symbol})}
          decimals={buyToken.decimals}
          needEnable={needEnable}
        />
        <Flex mt="24px" alignItems="center" justifyContent="space-between">
          <Text mr="8px" color="textSubtle">
            {t("You will get")}:
          </Text>
          <Flex
              alignItems="center"
            >
              <AnnualRoiDisplay>{formattedAnnualRoi} {token.symbol}</AnnualRoiDisplay>
            </Flex>
        </Flex>
        <ModalActions>
          <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
            {t("Cancel")}
          </Button>
          {needEnable ? (
            <Button
              width="100%"
              isLoading={enablePendingTx}
              endIcon={enablePendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
              onClick={handleApprove}
            >
              {t("Enable")}
            </Button>
          ) : pendingTx ? (
            <Button width="100%" isLoading={pendingTx} endIcon={<AutoRenewIcon spin color="currentColor" />}>
              {t("Confirming")}
            </Button>
          ) : (
            <Button
              width="100%"
              disabled={!lpTokensToStake.isFinite() || lpTokensToStake.eq(0) || lpTokensToStake.gt(fullBalanceNumber)}
              onClick={async () => {
                setPendingTx(true);
                await onConfirm(val);
                onDismiss?.();
                setPendingTx(false);
              }}
            >
              {t("Confirm")}
            </Button>
          )}
        </ModalActions>
        <LinkExternal href={addLiquidityUrl} style={{ alignSelf: "center" }}>
          {t("Get %symbol%", { symbol: buyToken.symbol })}
        </LinkExternal>
      </ModalBody>
    </Modal>
  );
};

export default DepositModal;
