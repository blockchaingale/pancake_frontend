import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import _toNumber from "lodash/toNumber";
import { useTranslation } from "@pancakeswap/localization";
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from "@pancakeswap/utils/formatBalance";
import { SerializedBond } from "@pancakeswap/capital";
// import { getInterestBreakdown } from "@pancakeswap/utils/compoundApyHelpers";
import { BIG_TEN, BIG_ZERO } from "@pancakeswap/utils/bigNumber";
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
  LinkExternal
} from "@pancakeswap/uikit";

const AnnualRoiContainer = styled((props) => <Flex {...props} />)`
  cursor: pointer;
`;

const AnnualRoiDisplay = styled((props) => <Text {...props} />)`
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`;

interface DepositModalProps {
  max: BigNumber;
  bond: SerializedBond;
  addLiquidityUrl?: string;
  enablePendingTx?: boolean;
  onDismiss?: () => void;
  onConfirm: (amount: string) => void;
  handleApprove?: () => void;
}

const DepositModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  max,
  bond,
  addLiquidityUrl = "",
  enablePendingTx,
  onConfirm,
  onDismiss,
  handleApprove
}) => {
  const [val, setVal] = useState("0");
  const [valUSDPrice, setValUSDPrice] = useState(BIG_ZERO);
  const [pendingTx, setPendingTx] = useState(false);
  const { t } = useTranslation();
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, bond.bondToken.decimals);
  }, [max, bond]);

  const needEnable = useMemo(() => {
    if (bond.userData.allowance) {
      const amount = getDecimalAmount(new BigNumber(val), bond.bondToken.decimals);
      return amount.gt(bond.userData.allowance);
    }
    return false;
  }, [bond, val]);

  const lpTokensToStake = val ? new BigNumber(val) : BIG_ZERO
  const fullBalanceNumber = useMemo(() => new BigNumber(fullBalance), [fullBalance]);

  const willGetValueBN = lpTokensToStake.div(new BigNumber(bond.bondPrice)).times(100)

  const willGetValueWithLP = bond.lpBond? willGetValueBN.times(bond.totalLpValue).div(bond.totalLpSupply).times(BIG_TEN.pow(9)) : willGetValueBN
  const formattedAnnualRoi = formatNumber(willGetValueWithLP.toNumber(), willGetValueWithLP.gt(10000) ? 0 : 2, willGetValueWithLP.gt(10000) ? 0 : 2);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        const inputVal = e.currentTarget.value.replace(/,/g, ".");
        setVal(inputVal);

        const USDPrice = inputVal === "" ? BIG_ZERO : new BigNumber(inputVal).times(bond.lpPrice);
        setValUSDPrice(USDPrice);
      }
    },
    [setVal, setValUSDPrice, bond]
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);

    const USDPrice = new BigNumber(fullBalance).times(bond.lpPrice);
    setValUSDPrice(USDPrice);
  }, [fullBalance, setVal, setValUSDPrice, bond]);

  const handlePercentInput = useCallback(
    (percent: number) => {
      const totalAmount = fullBalanceNumber.dividedBy(100).multipliedBy(percent);
      const amount = trimTrailZero(totalAmount.toNumber().toFixed(bond.bondToken.decimals));
      setVal(amount as string);

      const USDPrice = totalAmount.times(bond.lpPrice);
      setValUSDPrice(USDPrice);
    },
    [fullBalanceNumber, bond]
  );

  return (
    <Modal title={t("Mint %symbol% Bond", {symbol: bond.displayName})} onDismiss={onDismiss}>
      <ModalBody width={["100%", "100%", "100%", "420px"]}>
        <ModalInput
          value={val}
          valueUSDPrice={valUSDPrice}
          onSelectMax={handleSelectMax}
          onPercentInput={handlePercentInput}
          onChange={handleChange}
          max={fullBalance}
          maxAmount={fullBalanceNumber}
          symbol={bond.bondToken.symbol}
          addLiquidityUrl={addLiquidityUrl}
          inputTitle={t("Mint %symbol% Bond", {symbol: bond.displayName})}
          decimals={bond.bondToken.decimals}
          needEnable={needEnable}
        />
        <Flex mt="24px" alignItems="center" justifyContent="space-between">
          <Text mr="8px" color="textSubtle">
            {t("You will get")}:
          </Text>
          <Flex
              alignItems="center"
            >
              <AnnualRoiDisplay>{formattedAnnualRoi} DCP</AnnualRoiDisplay>
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
          {t("Get %symbol%", { symbol: bond.bondToken.symbol })}
        </LinkExternal>
      </ModalBody>
    </Modal>
  );
};

export default DepositModal;
