import addresses from 'config/constants/contracts'

import { GRAPH_API_PREDICTION_CAKE, GRAPH_API_PREDICTION_BNB } from 'config/constants/endpoints'
import { getAddress } from 'utils/addressHelpers'
import { ChainId } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'

export default {
  BNB: {
    address: getAddress(addresses.predictionsBNB, ChainId.BSC),
    api: GRAPH_API_PREDICTION_BNB,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracleBNB, ChainId.BSC),
    displayedDecimals: 4,
    token: bscTokens.bnb,
  },
  CAKE: {
    address: getAddress(addresses.predictionsCAKE, ChainId.BSC),
    api: GRAPH_API_PREDICTION_CAKE,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracleCAKE, ChainId.BSC),
    displayedDecimals: 4,
    token: bscTokens.cake,
  },
}
