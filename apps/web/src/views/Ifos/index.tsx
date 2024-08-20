// import { Button, Coming, Heading, SubMenuItems } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
// import Link from "next/link";
// import Image, { StaticImageData } from 'next/legacy/image'
import { useFetchIfo } from 'state/pools/hooks'
import styled from 'styled-components'
import Hero from './components/Hero'
import IfoProvider from './contexts/IfoContext'
// import bunnyImage from '../../../public/images/logo.png'


// const StyledComing = styled.div`
//   align-items: center;
//   display: flex;
//   flex-direction: column;
//   height: calc(100vh - 64px);
//   justify-content: center;
// `;

export const IfoPageLayout = ({ children }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isExact = router.route === '/ifo'
  useFetchIfo()

  return (
    <IfoProvider>
      {/* <SubMenuItems
        items={[
          {
            label: t('Latest'),
            href: '/ifo',
          },
          {
            label: t('Finished'),
            href: '/ifo/history',
          },
        ]}
        activeItem={isExact ? '/ifo' : '/ifo/history'}
      /> */}
      {/* <Hero /> */}
      {children}
    </IfoProvider>
  )
}
