import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import Image from '@/components/Image'
import SocialIcon from '@/components/social-icons'

export async function getStaticPaths() {
  // Get all author files to generate paths
  const fs = require('fs')
  const path = require('path')
  const authorsPath = path.join(process.cwd(), 'data', 'authors')
  const authorFiles = fs.readdirSync(authorsPath)

  const paths = authorFiles
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => {
      const authorId = file.replace(/\.(md|mdx)$/, '')
      return {
        params: {
          author: authorId,
        },
      }
    })

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllFilesFrontMatter('blog')

  // Load author details
  let authorDetails
  try {
    const authorData = await getFileBySlug('authors', [params.author])
    authorDetails = authorData.frontMatter
  } catch (error) {
    console.warn(`Author file not found for: ${params.author}`)
    authorDetails = { name: params.author }
  }

  // Load author details for each post
  const postsWithAuthors = await Promise.all(
    allPosts.map(async (post) => {
      if (post.authors && post.authors.length > 0) {
        const authorPromise = post.authors.map(async (author) => {
          try {
            const authorResults = await getFileBySlug('authors', [author])
            return authorResults.frontMatter
          } catch (error) {
            console.warn(`Author file not found for: ${author}`)
            return { name: author }
          }
        })
        const authorDetails = await Promise.all(authorPromise)
        return { ...post, authorDetails }
      }
      return post
    })
  )

  // Filter posts by the specific author
  const authorPosts = postsWithAuthors.filter((post) => {
    return post.authors && post.authors.includes(params.author)
  })

  return {
    props: {
      posts: authorPosts,
      authorDetails,
      authorId: params.author,
    },
  }
}

export default function AuthorPage({ posts, authorDetails, authorId }) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = authorDetails

  return (
    <>
      <PageSEO
        title={`Posts by ${name} - ${siteMetadata.author}`}
        description={`Blog posts written by ${name}`}
      />

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Author Profile Section */}
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="avatar"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-6xl font-bold text-gray-500 dark:text-gray-400">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                {name}
              </h1>
              {occupation && (
                <div className="text-xl text-gray-500 dark:text-gray-400 mt-2">{occupation}</div>
              )}
              {company && <div className="text-lg text-gray-500 dark:text-gray-400">{company}</div>}
              <div className="flex justify-center space-x-3 pt-6">
                {email && <SocialIcon kind="mail" href={`mailto:${email}`} />}
                {github && <SocialIcon kind="github" href={github} />}
                {linkedin && <SocialIcon kind="linkedin" href={linkedin} />}
                {twitter && <SocialIcon kind="twitter" href={twitter} />}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="pt-6">
          <ListLayout posts={posts} title={`Posts by ${name}`} initialDisplayPosts={posts} />
        </div>
      </div>
    </>
  )
}
