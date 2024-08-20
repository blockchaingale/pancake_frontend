import { ifosConfig } from 'config/constants'
// import CurrentIfo from './CurrentIfo'
// import SoonIfo from './SoonIfo'
import PastIfo from './PastIfo'

/**
 * Note: currently there should be only 1 active IFO at a time
 */
// const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const Ifo = () => {
  // return activeIfo ? <CurrentIfo activeIfo={activeIfo} /> : <SoonIfo />
  return <PastIfo />
}

export default Ifo
