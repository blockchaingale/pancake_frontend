import { useCallback } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { ChainId } from "@pancakeswap/sdk";
import { DCP, SDCP } from "@pancakeswap/tokens";
import { SerializedVault } from "@pancakeswap/capital";
import { Button, useToast, useModal, Flex } from "@pancakeswap/uikit";
import { useAppDispatch } from "state";
import { fetchCapitalUserDataAsync } from "state/capital";
import { useERC20 } from "hooks/useContract";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useCatchTxError from "hooks/useCatchTxError";
import { getDcpStakingAddress, getDcpStakingHelperAddress } from "utils/addressHelpers";
import { ToastDescriptionWithTx } from "components/Toast";
import useStakeVault from "../hooks/useStakeVault";
import useUnstakeVault from "../hooks/useUnstakeVault";
import useApprove from "../hooks/useApprove";
import StakeModal from "./StakeModal";
import UnstakeModal from "./UnstakeModal";

interface StakeComponentProps {
  vault: SerializedVault
}

export function useStakeActions(dcpContract, sdcpContract) {
  const { account, chainId } = useActiveWeb3React()
  const { onStake } = useStakeVault(account)
  const { onUnstake } = useUnstakeVault()
  const dispatch = useAppDispatch()

  const { onApprove: onDCPApprove } = useApprove(dcpContract, getDcpStakingHelperAddress(chainId))
  const { onApprove: onSDCPApprove } = useApprove(sdcpContract, getDcpStakingAddress(chainId))

  const onDone = useCallback(
    () => dispatch(fetchCapitalUserDataAsync({ account, ids: [0], chainId })),
    [account, chainId, dispatch],
  )

  return {
    onStake,
    onUnstake,
    onDCPApprove,
    onSDCPApprove,
    onDone,
  }
}

const StakeComponent: React.FunctionComponent<React.PropsWithChildren<StakeComponentProps>> = ({
  vault
}) => {
  const { t } = useTranslation();

  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const dcpContract = useERC20(DCP[ChainId.ARBITRUM].address)
  const sdcpContract = useERC20(SDCP[ChainId.ARBITRUM].address)

  const { onStake, onUnstake, onDCPApprove, onSDCPApprove, onDone } = useStakeActions(dcpContract, sdcpContract)

  const handleStake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => onStake(amount))

    if (receipt?.status) {
      toastSuccess(
        `${t('Staked DCP!')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have staked DCP.')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  const handleUnstake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => onUnstake(amount))

    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked SDCP!')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have unstaked SDCP.')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  const handleDCPApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => onDCPApprove())
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDone()
    }
  }, [onDCPApprove, t, toastSuccess, fetchWithCatchTxError, onDone])

  const handleSDCPApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => onSDCPApprove())
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDone()
    }
  }, [onSDCPApprove, t, toastSuccess, fetchWithCatchTxError, onDone])

  const [onPresentStake] = useModal(
    <StakeModal
      vault={vault}
      addLiquidityUrl={`/swap?outputCurrency=${DCP[ChainId.ARBITRUM].address}`}
      enablePendingTx={pendingTx}
      onConfirm={handleStake}
      handleApprove={handleDCPApprove}
    />,
    true,
    true,
    `vault-stake-modal`,
  )

  const [onPresentUnstake] = useModal(
    <UnstakeModal
      vault={vault}
      // addLiquidityUrl={`/swap?outputCurrency=${SDCP[ChainId.ARBITRUM].address}`}
      enablePendingTx={pendingTx}
      onConfirm={handleUnstake}
      handleApprove={handleSDCPApprove}
    />,
    true,
    true,
    `vault-unstake-modal`,
  )

  return (
    <Flex flexDirection="row" mb="20px">
      <Button onClick={onPresentStake} variant="secondary" mr="20px">
        {t("Stake DCP")}
      </Button>
      <Button onClick={onPresentUnstake} variant="secondary">
        {t("Unstake SDCP")}
      </Button>
    </Flex>
  );
};

export default StakeComponent;
