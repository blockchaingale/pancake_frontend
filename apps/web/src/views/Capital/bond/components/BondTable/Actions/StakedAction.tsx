import { useAccount } from 'wagmi'
import { TransactionResponse } from '@ethersproject/providers'
import { useTranslation } from '@pancakeswap/localization'
import { useModal, useToast } from '@pancakeswap/uikit'
import { SerializedBond } from '@pancakeswap/capital'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
// import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { fetchCapitalUserDataAsync } from 'state/capital'
// import { useTransactionAdder, useNonBscFarmPendingTransaction } from 'state/transactions/hooks'
// import { FarmTransactionStatus, NonBscFarmStepType } from 'state/transactions/actions'
// import { pickFarmTransactionTx } from 'state/global/actions'
// import { usePriceCakeBusd, useFarmFromPid } from 'state/farms/hooks'
// import BCakeCalculator from 'views/Farms/components/YieldBooster/components/BCakeCalculator'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import BigNumber from 'bignumber.js'
// import useNativeCurrency from 'hooks/useNativeCurrency'
// import { formatLpBalance } from '@pancakeswap/utils/formatBalance'
// import { ChainId, WNATIVE, NATIVE } from '@pancakeswap/sdk'
// import WalletModal, { WalletView } from 'components/Menu/UserMenu/WalletModal'
import useApproveBond from 'views/Capital/hooks/useApproveBond'
import useMintBond from 'views/Capital/hooks/useMintBond'
import AccountNotConnect from './AccountNotConnect'
import EnableStakeAction from './EnableStakeAction'
// import StakeActionDataNotReady from './StakeActionDataNotReady'
// import StakedActionComponent from './StakedActionComponent'
// import StakedLP from '../../StakedLP'
import StakeComponent from './StakeComponent'
import DepositModal from '../../DepositModal'

interface StackedActionProps {
  bond: SerializedBond
  onMint?: (value: string) => Promise<TransactionResponse>
  onDone?: () => void
  onApprove?: () => Promise<TransactionResponse>
  isApproved?: boolean
}

export function useStakedActions(lpContract, id, bondAddress, maxPremium) {
  const { account, chainId } = useActiveWeb3React()
  const { onMint } = useMintBond(bondAddress, account, maxPremium)
  const dispatch = useAppDispatch()

  const { onApprove } = useApproveBond(lpContract, bondAddress)

  const onDone = useCallback(
    () => dispatch(fetchCapitalUserDataAsync({ account, ids: [id], chainId })),
    [account, id, chainId, dispatch],
  )

  return {
    onMint,
    onApprove,
    onDone,
  }
}

export const StakedContainer = ({ children, ...props }) => {
  const { address: account } = useAccount()

  const { bond } = props
  const lpContract = useERC20(bond?.bondToken?.address)
  const maxPremium = new BigNumber(bond.bondPrice).times(1.005).toJSON()
  const { onMint, onApprove, onDone } = useStakedActions(lpContract, bond.id, bond.bondAddress, maxPremium)

  const { allowance } = bond.userData || {}

  const isApproved = account && allowance && new BigNumber(allowance).isGreaterThan(0)

  return children({
    bond,
    onMint,
    onDone,
    onApprove,
    isApproved,
  })
}

const Staked: React.FunctionComponent<React.PropsWithChildren<StackedActionProps>> = ({
  bond,
  onDone,
  onMint,
  onApprove,
  isApproved
}) => {
  // const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { account, chainId } = useActiveWeb3React()

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: bond.token0.address,
    tokenAddress: bond.token1.address,
    chainId,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const handleMint = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => onMint(amount))

    if (receipt?.status) {
      toastSuccess(
        `${t('Minted')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have minted %symbol% bond for DCP.', { symbol: bond.bondToken.symbol })}
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

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={new BigNumber(bond.userData.balance)}
      bond={bond}
      addLiquidityUrl={!bond.lpBond ? `/swap?outputCurrency=${bond.bondToken.address}` : `/add/${addLiquidityUrl}`}
      enablePendingTx={pendingTx}
      onConfirm={handleMint}
      handleApprove={handleApprove}
    />,
    true,
    true,
    `farm-deposit-modal-${bond.id}`,
  )

  if (!account) {
    return (
      <AccountNotConnect>
        <ConnectWalletButton width="100%" />
      </AccountNotConnect>
    )
  }

  if (!isApproved) {
    return <EnableStakeAction lpSymbol={bond.bondToken.symbol} pendingTx={pendingTx} handleApprove={handleApprove} />
  }

  return (
    <StakeComponent
      lpSymbol={bond.bondToken.symbol}
      onPresentDeposit={onPresentDeposit}
      isTokenOnly={!bond.lpBond}
    />
  )
}

export default Staked
