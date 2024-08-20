import PageLoader from 'components/Loader/PageLoader'
import dynamic from 'next/dynamic'
import { NextRouter, useRouter } from 'next/router'
import { useMemo } from 'react'
import { useGetCollection } from 'state/nftMarket/hooks'
import { COLLECTION_DATA } from 'config/constants/nft'
import Header from './Header'
import Items from './Items'

const Traits = dynamic(() => import('./Traits'), {
  loading: () => <PageLoader />,
})
const Activity = dynamic(() => import('./Activity'), {
  loading: () => <PageLoader />,
})

const getHashFromRouter = (router: NextRouter) => router.asPath.match(/#([a-z0-9]+)/gi)

const Collection = () => {
  const router = useRouter()
  // const collectionAddress = router.query.collectionAddress as string
  const collectionAddress = COLLECTION_DATA.address
  const collection = useGetCollection(collectionAddress)
  // const collection = COLLECTION_DATA

  const hash = useMemo(() => getHashFromRouter(router)?.[0], [router])

  if (!collection) {
    return <PageLoader />
  }

  let content = <Items />

  if (hash === '#traits') {
    content = <Traits />
  }

  if (hash === '#activity') {
    content = <Activity />
  }

  return (
    <>
      <Header collection={collection} />
      {content}
    </>
  )
}

export default Collection
