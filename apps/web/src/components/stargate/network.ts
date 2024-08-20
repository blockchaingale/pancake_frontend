import { mainnet, arbitrum, optimism, polygon, fantom, avalanche, bsc } from 'wagmi/chains'

// Chain Id is defined by Stargate
const stargateNetowrk = [
  
  {
    chainId: 109,
    name: 'Matic',
    chain: polygon,
  },
  {
    chainId: 110,
    name: 'Arbitrum',
    chain: arbitrum,
  },
]

export const findChainByStargateId = (chainId: number) => stargateNetowrk.find((s) => s.chainId === chainId)
