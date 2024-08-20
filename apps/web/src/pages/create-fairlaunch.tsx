import { ChainId } from '@pancakeswap/sdk'
import FairLaunch from 'views/CreateFairLaunch'

const LaunchpadPage = () => {
  return <FairLaunch />
}

LaunchpadPage.chains = [ChainId.ARBITRUM, ChainId.BSC, ChainId.POLYGON]

export default LaunchpadPage