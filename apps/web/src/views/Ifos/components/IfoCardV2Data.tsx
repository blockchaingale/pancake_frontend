import { useMemo } from 'react'
import useGetPublicIfoV2Data from 'views/Ifos/hooks/v2/useGetPublicIfoData'
import useGetWalletIfoV2Data from 'views/Ifos/hooks/v2/useGetWalletIfoData'
import { Ifo } from 'config/constants/types'
import IfoFoldableCard from './IfoFoldableCard'
import IfoContainer from './IfoContainer'
import IfoSteps from './IfoSteps'

interface Props {
  ifo: Ifo
}

const IfoCardV2Data: React.FC<React.PropsWithChildren<Props>> = ({ ifo }) => {
  const publicIfoData = useGetPublicIfoV2Data(ifo)
  const walletIfoData = useGetWalletIfoV2Data(ifo)

  const { poolBasic, poolUnlimited } = walletIfoData

  const isCommitted = useMemo(
    () =>
      poolBasic.amountTokenCommittedInLP.isGreaterThan(0) || poolUnlimited.amountTokenCommittedInLP.isGreaterThan(0),
    [poolBasic.amountTokenCommittedInLP, poolUnlimited.amountTokenCommittedInLP],
  )

  // return <IfoFoldableCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
  return <IfoContainer
            ifoSection={<IfoFoldableCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />}
            ifoSteps={
              <IfoSteps
                isLive={publicIfoData.status === 'live'}
                hasClaimed={poolBasic.hasClaimed || poolUnlimited.hasClaimed}
                isCommitted={isCommitted}
                ifoCurrencyAddress={ifo.currency.address}
              />
            }
          />

}

export default IfoCardV2Data
