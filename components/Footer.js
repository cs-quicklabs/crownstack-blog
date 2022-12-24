import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import Darkimage from '../public/static/images/Logo-dark.png'
import Lightimg from '../public/static/images/Logo-light.png'
import { useTheme } from 'next-themes'
import Image from 'next/image'

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer className="mt-6">
      <div className="mt-4 flex flex-col items-center">
        <div className="flex justify-center ">
          <Link href="https://crownstack.com/">
            {theme === 'dark' ? (
              <Image objectFit="cover" alt="Crownstack" src={Darkimage} width={250} height={55} />
            ) : (
              <Image objectFit="cover" alt="Crownstack" src={Lightimg} width={250} height={55} />
            )}
          </Link>
        </div>
        <div className="mb-3 ml-2 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size="6" />
          <SocialIcon kind="github" href={siteMetadata.github} size="6" />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size="6" />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size="6" />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size="6" />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size="6" />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <div>Crownstack Technologies Pvt Ltd</div>
        </div>
        <div className="mb-8 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>sales@crownstack.com</div>
          <div>{` • `}</div>
          <div>hr@crownstack.com</div>
        </div>
      </div>
    </footer>
  )
}
