import { ChainId } from '@pancakeswap/sdk'
import Launchpad from 'views/CreateLaunchpad'

const LaunchpadPage = () => {
  return <Launchpad />
}

LaunchpadPage.chains = [ChainId.ARBITRUM, ChainId.BSC, ChainId.POLYGON]

export default LaunchpadPage