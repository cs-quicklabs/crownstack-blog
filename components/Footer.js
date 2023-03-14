import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import Darkimage from '../public/static/images/Logo-dark.png'
import Lightimg from '../public/static/images/Logo-light.png'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function Footer() {
  const { theme } = useTheme()
  const [emailInput, setEmailInput] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const hasEmail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!emailInput) {
        setIsValidEmail(false)
      }
      if (isValidEmail && emailInput) {
        try {
          setButtonDisabled(true)
          const { data } = await axios({
            method: 'post',
            url: 'https://www.crownstack.com/blog-subscribe.php',
            data: { email_address: emailInput },
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          })
          if (data) {
            toast.success('Thank You for Subscribing')
            setEmailInput('')
            setButtonDisabled(false)
          }
        } catch (error) {
          toast.error('Something went wrong')
          setButtonDisabled(false)
        }
      }
    },
    [emailInput, setEmailInput, isValidEmail]
  )

  return (
    <footer className="mt-6">
      <div className="mt-4 flex flex-col items-center">
        <div className="mb-4">
          <div className="mb-4 text-center text-base font-medium text-gray-600 dark:text-gray-300 sm:font-semibold md:text-lg md:leading-6">
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
                className={`w-full flex-1 rounded-l-md border border-r-0 bg-white px-[3] py-1.5 text-gray-900 placeholder:text-sm focus:border-r-0 focus:outline-none focus:ring-0 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100 sm:px-4 sm:py-2 placeholder:sm:text-base ${
                  isValidEmail ? 'border-gray-400' : 'border-red-600'
                }`}
              />
              <button
                type="submit"
                disabled={buttonDisabled}
                className="flex items-center rounded-r-md border border-primary bg-primary px-2 py-2 text-sm text-white transition duration-150 ease-in-out hover:border-opacity-80 hover:bg-opacity-80 hover:shadow-xl focus:border-opacity-100 focus:bg-opacity-100 active:border-opacity-90 active:bg-opacity-90 sm:px-4 sm:py-2 sm:text-base"
              >
                {buttonDisabled && (
                  <span>
                    <svg
                      className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                )}
                <span>Subscribe</span>
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
        <div className="mb-4 flex flex-wrap justify-center gap-x-2 text-sm text-gray-500 dark:text-gray-400 sm:mb-2">
          <div>{siteMetadata.author}</div>
          <div>{` • © ${new Date().getFullYear()}`}</div>
          <div>{` • `}Crownstack Technologies Pvt Ltd</div>
        </div>
        <div className="mb-8 flex flex-wrap justify-center gap-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>sales@crownstack.com</div>
          <div>{` • `}hr@crownstack.com</div>
        </div>
      </div>
    </footer>
  )
}
