import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import Darkimage from '../public/static/images/Logo-dark.png'
import Lightimg from '../public/static/images/Logo-light.png'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useCallback, useState } from 'react'

export default function Footer() {
  const { theme } = useTheme()
  const [emailInput, setEmailInput] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(true)
  const hasEmail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (isValidEmail) {
        console.log('Email Submitted.', emailInput)
        setEmailInput('')
      }
    },
    [emailInput, setEmailInput, isValidEmail]
  )

  return (
    <footer className="mt-6">
      <div className="mt-4 flex flex-col items-center">
        <div className="mb-4">
          <div className="mb-4 text-lg font-medium leading-6 text-gray-600 dark:text-gray-300">
            Subscribe to our newsletter for more updates
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center">
              <input
                aria-label="Subscribe to our newsletter for more updates"
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value)
                  if (!hasEmail.test(emailInput)) {
                    setIsValidEmail(false)
                  } else {
                    setIsValidEmail(true)
                  }
                }}
                onBlur={(e) => {
                  if (!hasEmail.test(emailInput)) {
                    setIsValidEmail(false)
                  } else {
                    setIsValidEmail(true)
                  }
                }}
                placeholder="Enter email address"
                className={`w-full flex-1 rounded-l-md  border border-r-0 bg-white px-4 py-2  text-gray-900 focus:border-r-0 focus:outline-none focus:ring-0 dark:border-gray-900 dark:bg-gray-800  dark:text-gray-100 ${
                  isValidEmail ? 'border-gray-400' : 'border-red-600'
                }`}
              />
              <button
                type="submit"
                className="flex rounded-r-md border border-blue-400 bg-blue-400 px-4 py-2 text-white hover:shadow-xl"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
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
