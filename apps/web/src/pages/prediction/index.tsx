// import { ChainId } from '@pancakeswap/sdk'
// import PredictionConfigProviders from '../../views/Predictions/context/PredictionConfigProviders'
// import Predictions from '../../views/Predictions'

// export default function Prediction() {
//   return <Predictions />
// }

// Prediction.Layout = PredictionConfigProviders
// Prediction.chains = [ChainId.BSC, ChainId.ARBITRUM]

import { NotFound } from '@pancakeswap/uikit'

const NotFoundPage = () => <NotFound />

NotFoundPage.chains = []

export default NotFoundPage
