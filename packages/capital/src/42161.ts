import { ChainId, ERC20Token } from '@pancakeswap/sdk'
import { arbitrumTokens } from '@pancakeswap/tokens'
import { BondConfigBaseProps } from './types'

const getLPBondToken = (address: string) => {
  return new ERC20Token(
    ChainId.ARBITRUM,
    address,
    18,
    'Duckstail-LP',
    'Duckstail LPs',
  )
}

const bonds: BondConfigBaseProps[] = [
  {
    id: 0,
    name: "usdc",
    displayName: "USDC",
    lpBond: false,
    stableBond: true,
    bondToken: arbitrumTokens.usdc,
    token0: arbitrumTokens.usdc,
    token1: arbitrumTokens.usdc,
    bondAddress: "0x972c3cf752C4e68458e9EE8d73E9c70c136DE2Ca"
  },
  {
    id: 1,
    name: "usdt",
    displayName: "USDT",
    lpBond: false,
    stableBond: true,
    bondToken: arbitrumTokens.usdt,
    token0: arbitrumTokens.usdt,
    token1: arbitrumTokens.usdt,
    bondAddress: "0x261504D65eEE0036E8b600394f59B50716932e9D"
  },
  {
    id: 2,
    name: "frax",
    displayName: "FRAX",
    lpBond: false,
    stableBond: true,
    bondToken: arbitrumTokens.frax,
    token0: arbitrumTokens.frax,
    token1: arbitrumTokens.frax,
    bondAddress: "0x74860d4d485B9d2eeE729F82338Fd5b12cb6fCB5"
  },
  {
    id: 3,
    name: "dai",
    displayName: "DAI",
    lpBond: false,
    stableBond: true,
    bondToken: arbitrumTokens.dai,
    token0: arbitrumTokens.dai,
    token1: arbitrumTokens.dai,
    bondAddress: "0xAd672dbDDE47a7503E213d0810cB38494e1f514A"
  },
  // {
  //   id: 4,
  //   name: "usdc-dcp",
  //   displayName: "USDC-DCP LP",
  //   lpBond: true,
  //   stableBond: false,
  //   bondToken: getLPBondToken('0xE4CfAfF671De0b39695566e37Fe36eace0fd62dF'),
  //   token0: arbitrumTokens.dcp,
  //   token1: arbitrumTokens.usdc,
  //   bondAddress: "0x532E4b00Ff4f559f3F7d0E73C4274eC83120013c"
  // },
  // {
  //   id: 5,
  //   name: "usdt-dcp",
  //   displayName: "USDT-DCP LP",
  //   lpBond: true,
  //   stableBond: false,
  //   bondToken: getLPBondToken('0x168A4C3f7Bc744b05381D8F18588698179849556'),
  //   token0: arbitrumTokens.dcp,
  //   token1: arbitrumTokens.usdt,
  //   bondAddress: "0x39fb2785b681F87B1C8D511e1ABda0D9BffcE0d7"
  // },
  // {
  //   id: 6,
  //   name: "dai-dcp",
  //   displayName: "DAI-DCP LP",
  //   lpBond: true,
  //   stableBond: false,
  //   bondToken: getLPBondToken('0xd5c1aB8c4E2021C713dC536C0fEc599d248C846D'),
  //   token0: arbitrumTokens.dcp,
  //   token1: arbitrumTokens.dai,
  //   bondAddress: "0x8d3433f8ccfe4f9C3e54DD66006ABe73DbE13a8b"
  // },
].map((b) => ({ ...b, bondToken: b.bondToken.serialize, token0: b.token0.serialize, token1: b.token1.serialize }))

export default bonds
