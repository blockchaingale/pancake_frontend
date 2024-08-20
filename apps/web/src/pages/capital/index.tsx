import { ChainId } from '@pancakeswap/sdk'
import { CHAIN_IDS } from 'utils/wagmi'
import Capital from 'views/Capital'

const CapitalPage = () => {
  return (
      <Capital />
  )
}

CapitalPage.chains = [ChainId.ARBITRUM]

export default CapitalPage
