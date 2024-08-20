import BigNumber from "bignumber.js";
import { useCallback, useState } from "react";
import _toNumber from "lodash/toNumber";
import styled from "styled-components";
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
  TextArea,
} from "@pancakeswap/uikit";
import useCatchTxError from "hooks/useCatchTxError";
import { ToastDescriptionWithTx } from "components/Toast";
import { useAppDispatch } from "state";
import { fetchLaunchpadPublicDataAsync } from "state/launchpad";
import { isAddress } from "utils";
import usePool from "../hooks/usePool";

interface DepositModalProps {
  chainId: number
  pool: string
  onDismiss?: () => void
}

const StyledTextArea = styled(TextArea)`
  max-width: 100%;
  min-width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
  }
`

const AddWhitelistModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  chainId,
  pool,
  onDismiss,
}) => {
  const { fetchWithCatchTxError, loading: enablePendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()

  const [allocation, setAllocation] = useState<string[]>([])
  const [error, setError] = useState("")
  const [display, setDisplay] = useState("")

  const { onAddWhitelist } = usePool(pool, false)
  const dispatch = useAppDispatch()

  const onDone = useCallback(
    () => {
      dispatch(fetchLaunchpadPublicDataAsync({ address: pool, chainId }))
    },
    [pool, chainId, dispatch],
  )

  const onConfirm = async (val: string[]) => {
    const receipt = await fetchWithCatchTxError(() => onAddWhitelist(val))

    if (receipt?.status) {
      toastSuccess(
        `${t('Whitelist added')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have added whitelist.')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  const placeholder = `Insert Address: separate with breaks line.
Ex:
0x0000000000000000000000000000000000001000
0x0000000000000000000000000000000000002000
0x0000000000000000000000000000000000003000
  `

  const handleAllocation = (e: any) => {
    const value = e.target.value
    setDisplay(value)
    if (value !== "") {
      setError("")
    } else {
      setError("allocation is required")
    }
    const list = value.split("\n")
    const _allocation = []
    for (let i = 0; i < list.length; i++) {
      const element = list[i].replace(" ", "").replace(",", "")
      if (!isAddress(element)) {
        setError(`Invalid address at line ${i+1}`)
        return
      }
      _allocation.push(element)
    }
    setAllocation(_allocation)
  }

  return (
    <ModalForLaunchpad title={t("Add users to Whitelist")} onDismiss={onDismiss}>
      <Box width={["100%", "100%", "100%", "420px"]}>
        <Text fontSize="12px" color="primary">{t("Allocation*")}</Text>
        <StyledTextArea
          rows={12}
          placeholder={placeholder}
          value={display}
          onChange={handleAllocation}
        />
        {error !== "" && <Text color="failure" fontSize="14px" px="4px">
          {error}
        </Text>}
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
              disabled={error !== ""}
              onClick={async () => {
                setPendingTx(true);
                await onConfirm(allocation);
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

export default AddWhitelistModal;
