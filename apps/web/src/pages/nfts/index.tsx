// // import NftMarket from 'views/Nft/market/Home'

// // const NftMarketPage = () => {
// //   return <NftMarket />             
// // }

// // export default NftMarketPage

// import { GetStaticProps, InferGetStaticPropsType } from 'next'
// // eslint-disable-next-line camelcase
// import { SWRConfig, unstable_serialize } from 'swr'
// import { getCollection } from 'state/nftMarket/helpers'
// import CollectionPageRouter from 'views/Nft/market/Collection/CollectionPageRouter'
// import { COLLECTION_DATA } from 'config/constants/nft'

// const CollectionPage = ({ fallback = {} }: InferGetStaticPropsType<typeof getStaticProps>) => {
//   return (
//     <SWRConfig
//       value={{
//         fallback,
//       }}
//     >
//       <CollectionPageRouter />
//     </SWRConfig>
//   )
// }

// // export const getStaticPaths: GetStaticPaths = async () => {
// //   return {
// //     fallback: true,
// //     paths: [],
// //   }
// // }

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   // const { collectionAddress } = params
//   const collectionAddress = COLLECTION_DATA.address
//   if (typeof collectionAddress !== 'string') {
//     return {
//       notFound: true,
//     }
//   }

//   try {
//     const collectionData = await getCollection(collectionAddress)

//     if (collectionData) {
//       return {
//         props: {
//           fallback: {
//             [unstable_serialize(['nftMarket', 'collections', collectionAddress.toLowerCase()])]: { ...collectionData },
//           },
//         },
//         revalidate: 60 * 60 * 6, // 6 hours
//       }
//     }
//     return {
//       notFound: true,
//       revalidate: 60,
//     }
//   } catch (error) {
//     return {
//       notFound: true,
//       revalidate: 60,
//     }
//   }
// }

// export default CollectionPage

import { Coming1 } from '@pancakeswap/uikit'
// import { Flex, Box, FlexProps } from '@pancakeswap/uikit'
import { COLLECTION_DATA } from 'config/constants/nft'

import BannerHeader from 'views/Nft/market/components/BannerHeader'
// import AvatarImage from 'views/Nft/market/components/BannerHeader/AvatarImage'
// import StyledBannerImageWrapper from 'views/Nft/market/components/BannerHeader/BannerImage'

const CollectionPage = () => 
(<>
  <BannerHeader bannerImage={COLLECTION_DATA.banner.large} avatar={<></>} /> 
  <Coming1 />
</>)

export default CollectionPage
