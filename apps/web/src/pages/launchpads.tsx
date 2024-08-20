import { ChainId } from '@pancakeswap/sdk'
import Launchpads from 'views/Launchpads'

const LaunchpadsPage = () => {
  return <Launchpads />
}

LaunchpadsPage.chains = [ChainId.ARBITRUM, ChainId.BSC, ChainId.POLYGON]

export default LaunchpadsPage