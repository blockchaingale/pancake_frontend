import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { addWhiteList, cancel, contributeForETH, contributeForToken, disableWhitelist, enableWhitelist, finalize, removeWhiteList, updateInfo } from 'utils/calls'
import { useLaunchpadETH, useLaunchpadToken } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const usePool = (launchpad: string, isNative: boolean) => {
  const launchpadContractETH = useLaunchpadETH(launchpad)
  const launchpadContractToken = useLaunchpadETH(launchpad)
  const launchpadContract = isNative ? launchpadContractETH : launchpadContractToken
  // const gasPrice = useGasPrice()

  const handleDeposit = useCallback(async (amount: string, decimals: number) => {
    return isNative ? contributeForETH(launchpadContract, amount) : contributeForToken(launchpadContract, new BigNumber(amount).times(10**decimals).toJSON())
  }, [launchpadContract, isNative])

  const handleDisableWhitelist = useCallback(async () => {
    return disableWhitelist(launchpadContract)
  }, [launchpadContract])

  const handleEnableWhitelist = useCallback(async (value: string) => {
    return enableWhitelist(launchpadContract, value)
  }, [launchpadContract])

  const handleAddWhiteList = useCallback(async (value: string[]) => {
    return addWhiteList(launchpadContract, value)
  }, [launchpadContract])

  const handleRemoveWhiteList = useCallback(async (value: string[]) => {
    return removeWhiteList(launchpadContract, value)
  }, [launchpadContract])

  const handleCancel = useCallback(async () => {
    return cancel(launchpadContract)
  }, [launchpadContract])

  const handleFinalize = useCallback(async () => {
    return finalize(launchpadContract)
  }, [launchpadContract])

  const handleUpdateInfo = useCallback(async (value: string[]) => {
    return updateInfo(launchpadContract, value)
  }, [launchpadContract])

  return { 
    onDeposit: handleDeposit,
    onDisableWhitelist: handleDisableWhitelist,
    onEnableWhitelist: handleEnableWhitelist,
    onAddWhitelist: handleAddWhiteList,
    onRemoveWhitelist: handleRemoveWhiteList,
    onCancel: handleCancel,
    onFinalize: handleFinalize,
    onUpdateInfo: handleUpdateInfo
  }
}

export default usePool
