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
      <div className="flex justify-center ">
        <Link href="https://crownstack-website-new.vercel.app/">
          {theme === 'dark' ? (
            <Image alt="Crownstack" src={Darkimage} width={250} height={60} />
          ) : (
            <Image alt="Crownstack" src={Lightimg} width={250} height={60} />
          )}
        </Link>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
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
          <p href="/">{siteMetadata.title}</p>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="https://crownstack-website-new.vercel.app/">
            Crownstack Technologies Pvt Ltd
          </Link>
        </div>
      </div>
    </footer>
  )
}
// import Link from './Link'
// import siteMetadata from '@/data/siteMetadata'
// import SocialIcon from '@/components/social-icons'
// import { Image } from 'next/image'

// export default function Footer() {

//   return (
//     <footer>

//       <div className="mt-16 flex flex-col items-center">
//         <div className="mb-3 flex space-x-4">
//           <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size="6" />
//           <SocialIcon kind="github" href={siteMetadata.github} size="6" />
//           <SocialIcon kind="facebook" href={siteMetadata.facebook} size="6" />
//           <SocialIcon kind="youtube" href={siteMetadata.youtube} size="6" />
//           <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size="6" />
//           <SocialIcon kind="twitter" href={siteMetadata.twitter} size="6" />
//         </div>
//         <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
//           <div>{siteMetadata.author}</div>
//           <div>{` • `}</div>
//           <div>{`© ${new Date().getFullYear()}`}</div>
//           <div>{` • `}</div>
//           <p href="/">{siteMetadata.title}</p>
//         </div>
//         <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
//           <Link href="https://crownstack-website-new.vercel.app/">
//             Crownstack Technologies Pvt Ltd
//           </Link>
//         </div>
//       </div>
//     </footer>
//   )
// }
