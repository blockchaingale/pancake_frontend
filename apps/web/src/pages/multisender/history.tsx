import { ChainId } from '@pancakeswap/sdk'
import History from 'views/Airdrop/history'

const HistoryPage = ({ userIp }) => {
  return <History />
}

HistoryPage.chains = [ChainId.ARBITRUM, ChainId.POLYGON, ChainId.BSC]

export default HistoryPage


// import { NotFound } from '@pancakeswap/uikit'

// const NotFoundPage = () => <NotFound />

// NotFoundPage.chains = []

// export default NotFoundPage