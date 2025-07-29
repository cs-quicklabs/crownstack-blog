import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'

export default function AuthorLayout({
  children,
  frontMatter,
  layout = 'sidebar', // 'sidebar', 'centered', 'card'
  showSEO = true,
  title = 'About',
  description = null,
  imageSize = 'large', // 'small' (128px), 'medium' (192px), 'large' (192px)
  showProfile = true,
  showSocialIcons = true,
  socialIconsPosition = 'default', // 'default', 'bottom'
}) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = frontMatter

  // Image size configuration
  const imageSizes = {
    small: { width: 128, height: 128, className: 'w-32 h-32' },
    medium: { width: 192, height: 192, className: 'w-48 h-48' },
    large: { width: 192, height: 192, className: 'w-48 h-48' },
  }

  const imageConfig = imageSizes[imageSize]

  // SEO component
  const SEOComponent = showSEO ? (
    <PageSEO
      title={description ? `${title} - ${name}` : `About - ${name}`}
      description={description || `About me - ${name}`}
    />
  ) : null

  // Author profile component
  const AuthorProfile = () => (
    <div
      className={`${imageConfig.className} rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt="avatar"
          width={imageConfig.width}
          height={imageConfig.height}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <span
            className={`font-bold text-gray-500 dark:text-gray-400 ${
              imageSize === 'small' ? 'text-2xl' : 'text-6xl'
            }`}
          >
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )

  // Social icons component
  const SocialIcons = () => (
    <div
      className={`flex space-x-3 justify-center ${
        socialIconsPosition === 'bottom' ? 'mt-4' : 'pt-6'
      }`}
    >
      {email && <SocialIcon kind="mail" href={`mailto:${email}`} />}
      {github && <SocialIcon kind="github" href={github} />}
      {linkedin && <SocialIcon kind="linkedin" href={linkedin} />}
      {twitter && <SocialIcon kind="twitter" href={twitter} />}
    </div>
  )

  // Sidebar layout (original About page layout)
  if (layout === 'sidebar') {
    return (
      <>
        {SEOComponent}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pb-8 pt-6 md:space-y-5">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              {title}
            </h1>
          </div>
          <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
            <div className="flex flex-col items-center pt-8">
              {showProfile && <AuthorProfile />}
              <h2 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">{name}</h2>
              <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
              <div className="text-gray-500 dark:text-gray-400">{company}</div>
              {showSocialIcons && <SocialIcons />}
            </div>
            <div className="prose max-w-none pb-8 pt-8 dark:prose-dark xl:col-span-2">
              {children}
            </div>
          </div>
        </div>
      </>
    )
  }

  // Centered layout (individual author page)
  if (layout === 'centered') {
    return (
      <>
        {SEOComponent}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pb-8 pt-6 md:space-y-5">
            <div className="flex flex-col items-center space-y-4">
              {showProfile && <AuthorProfile />}
              <div className="text-center">
                <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                  {name}
                </h1>
                {occupation && (
                  <div className="text-xl text-gray-500 dark:text-gray-400 mt-2">{occupation}</div>
                )}
                {company && (
                  <div className="text-lg text-gray-500 dark:text-gray-400">{company}</div>
                )}
                {showSocialIcons && <SocialIcons />}
              </div>
            </div>
          </div>
          {children && <div className="pt-6">{children}</div>}
        </div>
      </>
    )
  }

  // Card layout (authors list page)
  if (layout === 'card') {
    return (
      <div className="flex flex-col items-center space-y-4 text-center w-full">
        {showProfile && <AuthorProfile />}
        <div className="space-y-2 w-full">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{name}</h2>
          {occupation && <p className="text-sm text-gray-600 dark:text-gray-400">{occupation}</p>}
          {company && <p className="text-sm text-gray-500 dark:text-gray-500">{company}</p>}
          {children}
        </div>
        {showSocialIcons && <SocialIcons />}
      </div>
    )
  }

  // Default fallback
  return null
}
