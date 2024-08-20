import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import _toNumber from "lodash/toNumber";
import { useTranslation } from "@pancakeswap/localization";
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from "@pancakeswap/utils/formatBalance";
import { SerializedVault } from "@pancakeswap/capital";
// import { getInterestBreakdown } from "@pancakeswap/utils/compoundApyHelpers";
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import { trimTrailZero } from "@pancakeswap/utils/trimTrailZero";
import { 
  Modal, 
  // ModalV2, 
  ModalBody, 
  ModalActions, 
  ModalInput,
  Flex,
  // Box,
  Text,
  Button,
  // IconButton,
  // Skeleton,
  // Message,
  // MessageText,
  AutoRenewIcon,
  // ErrorIcon,
  // CalculateIcon,
  // RoiCalculatorModal,
  // LinkExternal
} from "@pancakeswap/uikit";
// import { useDCPUSDTPrice } from "state/capital/hooks";

interface DepositModalProps {
  vault: SerializedVault;
  // addLiquidityUrl?: string;
  enablePendingTx?: boolean;
  onDismiss?: () => void;
  onConfirm: (amount: string) => void;
  handleApprove?: () => void;
}

const UnstakeModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  vault,
  // addLiquidityUrl = "",
  enablePendingTx,
  onConfirm,
  onDismiss,
  handleApprove
}) => {
  // const dcpPrice = useDCPUSDTPrice({ forceMainnet: true })
  const [val, setVal] = useState("0");
  // const [valUSDPrice, setValUSDPrice] = useState(BIG_ZERO);
  const [pendingTx, setPendingTx] = useState(false);
  const { t } = useTranslation();
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(new BigNumber(vault.userData.sdcp.balance), 9);
  }, [vault]);

  const needEnable = useMemo(() => {
    if (vault.userData.sdcp.allowance) {
      const amount = getDecimalAmount(new BigNumber(val), 9);
      return amount.gt(vault.userData.sdcp.allowance);
    }
    return false;
  }, [vault, val]);

  const lpTokensToStake = val ? new BigNumber(val) : BIG_ZERO
  const fullBalanceNumber = useMemo(() => new BigNumber(fullBalance), [fullBalance]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        const inputVal = e.currentTarget.value.replace(/,/g, ".");
        setVal(inputVal);

        // const USDPrice = inputVal === "" ? BIG_ZERO : new BigNumber(inputVal).times(dcpPrice);
        // setValUSDPrice(USDPrice);
      }
    },
    [setVal]
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);

    // const USDPrice = new BigNumber(fullBalance).times(dcpPrice);
    // setValUSDPrice(USDPrice);
  }, [fullBalance, setVal]);

  const handlePercentInput = useCallback(
    (percent: number) => {
      const totalAmount = fullBalanceNumber.dividedBy(100).multipliedBy(percent);
      const amount = trimTrailZero(totalAmount.toNumber().toFixed(9));
      setVal(amount as string);

      // const USDPrice = totalAmount.times(dcpPrice);
      // setValUSDPrice(USDPrice);
    },
    [fullBalanceNumber]
  );

  return (
    <Modal title={t("Unstake %symbol%", {symbol: "SDCP"})} onDismiss={onDismiss}>
      <ModalBody width={["100%", "100%", "100%", "420px"]}>
        <ModalInput
          value={val}
          onSelectMax={handleSelectMax}
          onPercentInput={handlePercentInput}
          onChange={handleChange}
          max={fullBalance}
          maxAmount={fullBalanceNumber}
          symbol="SDCP"
          // addLiquidityUrl={addLiquidityUrl}
          inputTitle={t("Unstake SDCP")}
          decimals={9}
          needEnable={needEnable}
        />
        {/* <Flex mt="24px" alignItems="center" justifyContent="space-between">
          <Text mr="8px" color="textSubtle">
            {t("You will get")}:
          </Text>
          <Flex
              alignItems="center"
            >
              <AnnualRoiDisplay>{formattedAnnualRoi} SDCP</AnnualRoiDisplay>
            </Flex>
        </Flex> */}
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
        {/* <LinkExternal href={addLiquidityUrl} style={{ alignSelf: "center" }}>
          {t("Get %symbol%", { symbol: "DCP" })}
        </LinkExternal> */}
      </ModalBody>
    </Modal>
  );
};

export default UnstakeModal;
