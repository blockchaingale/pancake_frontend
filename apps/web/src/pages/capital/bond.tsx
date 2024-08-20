import { ChainId } from '@pancakeswap/sdk'
import { CHAIN_IDS } from 'utils/wagmi'
import Bonds from 'views/Capital/bond'

const BondPage = () => {
  return (
    <Bonds />
  )
}

BondPage.chains = [ChainId.ARBITRUM]

export default BondPage
