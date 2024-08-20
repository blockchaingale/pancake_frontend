import { Box, Flex, Text, NftIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftAttribute } from 'state/nftMarket/types'
import ExpandableCard from './ExpandableCard'

interface PropertiesCardProps {
  properties: NftAttribute[]
  rarity: { [key: string]: number }
}

// Map of known traits to human-readable text
const KNOWN_TRAITS_TEXT = {
  bunnyId: 'Bunny ID',
}

const SingleProperty: React.FC<React.PropsWithChildren<{ title: string; value: string | number }>> = ({
  title,
  value,
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
        {KNOWN_TRAITS_TEXT[title] ?? title}
      </Text>
      <Flex alignItems="center">
        <Text bold textTransform="uppercase" mr="4px">
          {value}
        </Text>
      </Flex>
    </Flex>
  )
}

const TokenDataCard = ({ nftData, userData }) => {
  const { t } = useTranslation()

  const myLastTime = userData?.lastProcessingTimestamp;

  const passedTime = myLastTime? Math.floor(Date.now() / 1000) - myLastTime : 7200;

  const content = (
    <Box p="24px">
      <SingleProperty
        key="tvs"
        title="Total Value Staked"
        value={new Intl.NumberFormat("en-US").format(Math.floor(nftData?.nft.amount/10**18))}
      />
      <SingleProperty
        key="gift"
        title="Gift Value"
        value={new Intl.NumberFormat("en-US").format(Math.floor(nftData?.nft.giftValue/10**18))}
      />
      {userData && <SingleProperty
        key="yvs"
        title="Your Value Staked"
        value={new Intl.NumberFormat("en-US").format(Math.floor(userData?.amount/10**18))}
      />}
      {userData && <SingleProperty
        key="ypr"
        title="Your Pending Reward"
        value={new Intl.NumberFormat("en-US").format(Math.floor(userData?.amount * passedTime * 34724 / 10**29))}
      />}
    </Box>
  )
  return <ExpandableCard title={t('Information')} icon={<NftIcon width="24px" height="24px" />} content={content} />
}

export default TokenDataCard
