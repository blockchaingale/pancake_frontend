import BigNumber from "bignumber.js";
import { useCallback, useState } from "react";
import _toNumber from "lodash/toNumber";
import { useTranslation } from "@pancakeswap/localization";
import { 
  Modal, 
  ModalBody, 
  ModalActions, 
  Button,
  AutoRenewIcon,
  useToast,
  Box,
  Text,
  Flex,
  Checkbox,
  Input,
  ModalForLaunchpad,
} from "@pancakeswap/uikit";
import useCatchTxError from "hooks/useCatchTxError";
import { ToastDescriptionWithTx } from "components/Toast";
import { useAppDispatch } from "state";
import { fetchLaunchpadPublicDataAsync } from "state/launchpad";
import usePool from "../hooks/usePool";

interface DepositModalProps {
  chainId: number
  account: string
  pool: string
  endTime: number
  onDismiss?: () => void
}

const SetWhitelistModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  chainId,
  account,
  pool,
  endTime,
  onDismiss,
}) => {
  const { fetchWithCatchTxError, loading: enablePendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()

  const [enablePublicTime, setEnablePublicTime] = useState<boolean>(false)
  const [time, setTime] = useState<string>("")
  const [publicTime, setPublicTime] = useState<BigNumber>(new BigNumber(endTime))

  const { onEnableWhitelist } = usePool(pool, false)
  const dispatch = useAppDispatch()

  const onDone = useCallback(
    () => {
      dispatch(fetchLaunchpadPublicDataAsync({ address: pool, chainId }))
    },
    [pool, chainId, dispatch],
  )

  const onConfirm = async (val: string) => {
    const receipt = await fetchWithCatchTxError(() => onEnableWhitelist(val))

    if (receipt?.status) {
      toastSuccess(
        `${t('Sale type changed')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have changed sale type to whitelisted.')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  const handleChangePublicTime = (e) => {
    const value = e.target.value
    setTime(value)
    setPublicTime(new BigNumber(Date.parse(`${value.replace("T", " ")} GMT`)).div(1000))
  }

  return (
    <ModalForLaunchpad title={t("Whitelist Setting")} onDismiss={onDismiss}>
      <Box width={["100%", "100%", "100%", "420px"]}>
        <Flex alignItems="center" mb="10px" onClick={() => setEnablePublicTime(!enablePublicTime)}>
          <Checkbox
            scale="sm"
            checked={enablePublicTime}
            readOnly
          />
          <Text ml="10px">{t("Setting Public Sale Start Time")}</Text>
        </Flex>
        {enablePublicTime && <Box width="100%">
          <Text fontSize="12px" color="primary">{t("Public Sale Start Time (UTC)*")}</Text>
          <Input
            type="datetime-local"
            placeholder={t("Select date")}
            scale="md"
            value={time}
            onChange={handleChangePublicTime}
          />
        </Box>}
        <ModalActions>
          <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
            {t("Cancel")}
          </Button>
          {pendingTx ? (
            <Button width="100%" isLoading={pendingTx} endIcon={<AutoRenewIcon spin color="currentColor" />}>
              {t("Confirming")}
            </Button>
          ) : (
            <Button
              width="100%"
              // disabled={}
              onClick={async () => {
                setPendingTx(true);
                await onConfirm(publicTime.toJSON());
                onDismiss?.();
                setPendingTx(false);
              }}
            >
              {t("Confirm")}
            </Button>
          )}
        </ModalActions>
      </Box>
    </ModalForLaunchpad>
  );
};

export default SetWhitelistModal;
