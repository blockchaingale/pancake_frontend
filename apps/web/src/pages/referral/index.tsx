import { ChainId } from '@pancakeswap/sdk'
import Referral from 'views/Referral/referral'

const ReferralPage = ({ userIp }) => {
  return <Referral />
}

ReferralPage.chains = [ChainId.ARBITRUM, ChainId.POLYGON, ChainId.BSC]

export default ReferralPage


// import { NotFound } from '@pancakeswap/uikit'

// const NotFoundPage = () => <NotFound />

// NotFoundPage.chains = []

// export default NotFoundPage