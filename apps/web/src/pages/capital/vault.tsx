import { ChainId } from '@pancakeswap/sdk'
import { CHAIN_IDS } from 'utils/wagmi'
import Vault from 'views/Capital/vault'

const VaultPage = () => {
  return (
    <Vault />
  )
}

VaultPage.chains = [ChainId.ARBITRUM]

export default VaultPage
