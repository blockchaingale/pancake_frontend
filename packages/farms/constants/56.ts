import { bscTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'MM',
    lpAddress: '0x8A8BD24B8718dDdD878F45Ff909a4A55B7E7Fb90',
    quoteToken: bscTokens.wbnb,
    token: bscTokens.mmtoken,
    isTokenOnly: true,
  },
  {
    pid: 1,
    lpSymbol: 'MM-BNB LP',
    lpAddress: '0x4A6aFf0767D96f80Bdbd72A6fB489c316DA03dB0',
    quoteToken: bscTokens.mmtoken,
    token: bscTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'MM-USDT LP',
    lpAddress: '0x1f5Af9a3223292A09ce85BE9B54a8d9A887Bd422',
    quoteToken: bscTokens.mmtoken,
    token: bscTokens.usdt,
  },
  {
    pid: 3,
    lpSymbol: 'WBNB',
    lpAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    quoteToken: bscTokens.mmtoken,
    token: bscTokens.wbnb,
    isTokenOnly: true,
  },
  {
    pid: 4,
    lpSymbol: 'USDT',
    lpAddress: '0x55d398326f99059ff775485246999027b3197955',
    quoteToken: bscTokens.usdt,
    token: bscTokens.usdt,
    isTokenOnly: true,
  },
  {
    pid: 5,
    lpSymbol: 'BNB-USDT LP',
    lpAddress: '0x8E3084D1F7246BD63f8df09eCa075B738C757696',
    quoteToken: bscTokens.bnb,
    token: bscTokens.usdt,
  },
  // {
  //   pid: 6,
  //   lpSymbol: 'BNB-USDC LP',
  //   lpAddress: '0xf1F27432eE9f9D1c366C45Ff06dEa2C38586F825',
  //   quoteToken: bscTokens.bnb,
  //   token: bscTokens.usdc,
  // },
  // {
  //   pid: 7,
  //   lpSymbol: 'USDT-USDC LP',
  //   lpAddress: '0x06Da11093bc03D54d214391e32A1A61A527A71C3',
  //   quoteToken: bscTokens.usdt,
  //   token: bscTokens.usdc,
  // },
  // {
  //   pid: 8,
  //   lpSymbol: 'USDC-DAI LP',
  //   lpAddress: '0x3dc0814D9DB34Dd6223c727000a05ea0e8cB0d34',
  //   quoteToken: bscTokens.usdc,
  //   token: bscTokens.dai,
  // },
  // {
  //   pid: 9,
  //   lpSymbol: 'BTCB-USDT LP',
  //   lpAddress: '0x89276b05e5702904915BCbc6A0e217fd28F94694',
  //   quoteToken: bscTokens.usdt,
  //   token: bscTokens.btcb,
  // },
  // {
  //   pid: 10,
  //   lpSymbol: 'BTCB-DAI LP',
  //   lpAddress: '0x8Cba424799789F7E1c0090445fDDB0c1399aF00b',
  //   quoteToken: bscTokens.btcb,
  //   token: bscTokens.dai,
  // },
  // {
  //   pid: 11,
  //   lpSymbol: 'BNB-ETH LP',
  //   lpAddress: '0x4889dbeB2467Cd4f343B5Cf0FB9448dD090a0198',
  //   quoteToken: bscTokens.wbnb,
  //   token: bscTokens.eth,
  // },
  // {
  //   pid: 12,
  //   lpSymbol: 'USDC-ETH LP',
  //   lpAddress: '0x19751f7F4d1b697f09f6306e0CB3924E42E9c545',
  //   quoteToken: bscTokens.usdc,
  //   token: bscTokens.eth,
  // },
  // {
  //   pid: 13,
  //   lpSymbol: 'USDT-ETH LP',
  //   lpAddress: '0xB1551C126e7499da5ECEf63593C25dC28Cd63Bc8',
  //   quoteToken: bscTokens.usdt,
  //   token: bscTokens.eth,
  // },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
