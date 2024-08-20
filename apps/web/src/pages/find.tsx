import { ChainId } from '@pancakeswap/sdk'
import { CHAIN_IDS } from 'utils/wagmi'
import PoolFinder from 'views/PoolFinder'

const PoolFinderPage = () => <PoolFinder />

PoolFinderPage.chains = [ChainId.ARBITRUM, ChainId.BSC, ChainId.POLYGON, ChainId.ETHEREUM]

export default PoolFinderPage
