import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import Image from '@/components/Image'
import Link from '@/components/Link'
import SocialIcon from '@/components/social-icons'

export async function getStaticProps() {
  const allPosts = await getAllFilesFrontMatter('blog')

  // Get all author files
  const fs = require('fs')
  const path = require('path')
  const authorsPath = path.join(process.cwd(), 'data', 'authors')
  const authorFiles = fs.readdirSync(authorsPath)

  // Load all authors with their post counts
  const authors = await Promise.all(
    authorFiles
      .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(async (file) => {
        const authorId = file.replace(/\.(md|mdx)$/, '')

        try {
          const authorData = await getFileBySlug('authors', [authorId])
          const authorDetails = authorData.frontMatter

          // Count posts by this author
          const postCount = allPosts.filter(
            (post) => post.authors && post.authors.includes(authorId)
          ).length

          return {
            id: authorId,
            ...authorDetails,
            postCount,
          }
        } catch (error) {
          console.warn(`Author file not found for: ${authorId}`)
          return {
            id: authorId,
            name: authorId,
            postCount: 0,
          }
        }
      })
  )

  // Sort authors by post count (descending) and then by name
  const sortedAuthors = authors.sort((a, b) => {
    if (b.postCount !== a.postCount) {
      return b.postCount - a.postCount
    }
    return a.name.localeCompare(b.name)
  })

  return {
    props: {
      authors: sortedAuthors,
    },
  }
}

export default function AuthorsPage({ authors }) {
  return (
    <>
      <PageSEO
        title={`Authors - ${siteMetadata.author}`}
        description="Meet our team of writers and contributors"
      />

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Authors
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Meet our team of writers and contributors who share their expertise and insights.
          </p>
        </div>

        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <div
                key={author.id}
                className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <Link
                  href={`/authors/${author.id}`}
                  className="flex flex-col items-center space-y-4 text-center w-full"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {author.avatar ? (
                      <Image
                        src={author.avatar}
                        alt={author.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                          {author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 w-full">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {author.name}
                    </h2>

                    {author.occupation && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {author.occupation}
                      </p>
                    )}

                    {author.company && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">{author.company}</p>
                    )}

                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {author.postCount} post{author.postCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="mt-4 flex space-x-3">
                  {author.email && <SocialIcon kind="mail" href={`mailto:${author.email}`} />}
                  {author.github && <SocialIcon kind="github" href={author.github} />}
                  {author.linkedin && <SocialIcon kind="linkedin" href={author.linkedin} />}
                  {author.twitter && <SocialIcon kind="twitter" href={author.twitter} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
