import { useRouter } from 'next/router'
import { useGetCollection } from 'state/nftMarket/hooks'
import { COLLECTION_DATA } from 'config/constants/nft'
import ActivityHistory from '../../ActivityHistory/ActivityHistory'

const Activity = () => {
  // const collectionAddress = useRouter().query.collectionAddress as string
  const collectionAddress = COLLECTION_DATA.address
  const collection = useGetCollection(collectionAddress)
  // const collection = COLLECTION_DATA

  return (
    <>
      <ActivityHistory collection={collection} />
    </>
  )
}

export default Activity
