import { STokenImage, STokenPairImage, TokenImage, TokenPairImage } from 'components/TokenImage'
// import { bscTokens } from '@pancakeswap/tokens'
import { SerializedBond } from '@pancakeswap/capital'
import BondTokenInfo from './BondTokenInfo'

interface BondTableFarmTokenInfoProps {
  bond?: SerializedBond
}

const Bond: React.FunctionComponent<React.PropsWithChildren<BondTableFarmTokenInfoProps>> = ({
  bond
}) => {

  return (
    <BondTokenInfo
      bond={bond}
    >
      {!bond.lpBond ?
        <STokenImage width={40} height={40} token={bond.bondToken} />
        :
        <STokenPairImage width={40} height={40} variant="inverted" primaryToken={bond.token0} secondaryToken={bond.token1} />
      }
    </BondTokenInfo>
  )
}

export default Bond
