import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What’s the difference between a Basic Sale and Unlimited Sale?</Trans>,
    description: [
      <Trans>
        In both Basic and Unlimited Sale, everyone can commit SMR to earn MM. But in the Unlimited Sale has a participation fee: see below. 
      </Trans>
    ],
  },
  {
    title: <Trans>Which sale should I commit to? Can I do both?</Trans>,
    description: [
      <Trans>You can choose one or both at the same time!</Trans>,
      <Trans>
        You are eligible to participate in the Basic Sale and Unlimited Sale. In the Unlimited Sale, if the amount you commit is too small, you may not receive a meaningful amount of MM tokens.
      </Trans>
    ],
  },
  {
    title: <Trans>How much is the participation fee?</Trans>,
    description: [
      <Trans>There’s only a participation fee for the Unlimited Sale: there’s no fee for the Basic Sale.</Trans>,
      <Trans>
        The participation fee decreases in cliffs, based on the percentage of overflow from the Unlimited Sale” portion of
        the presale.
      </Trans>
    ],
  },
  {
    title: <Trans>Where does the participation fee go?</Trans>,
    description: [<Trans>The SMR from the participation fee will go to Duckstail team wallet.</Trans>],
  },
  {
    title: <Trans>How can I get an achievement for participating in the presale?</Trans>,
    description: [
      <Trans>You need to contribute a minimum of about 10 USD worth of SMR to either sale.</Trans>,
      <Trans>
        You can contribute to one or both, it doesn’t matter: only your overall contribution is counted for the
        achievement.
      </Trans>,
    ],
  }
]
export default config
