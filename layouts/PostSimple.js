import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'
import Comments from '@/components/comments'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
export default function PostLayout({ frontMatter, authorDetails, next, prev, children }) {
  const { date, title } = frontMatter
  const authorNames = authorDetails?.map((author) => author.name).join(',')
  const imageUrl =
    'https://blog.crownstack.com' +
    '/api/ogImage?' +
    'title=' +
    encodeURIComponent(frontMatter.title) +
    '&author=' +
    encodeURIComponent(authorNames) +
    '&cover=' +
    encodeURIComponent('/static/images/Logo-light.png')

  return (
    <SectionContainer>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${frontMatter.slug}`}
        {...frontMatter}
        images={[imageUrl]}
      />
      <ScrollTopAndComment />
      <article>
        <div>
          <header>
            <div className="space-y-1 border-b border-gray-200 pb-8 text-center dark:border-gray-700">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>{formatDate(date)}</time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              <dl className="">
                <dt className="sr-only">Authors</dt>
                <dd className="mt-4">
                  <div className="flex flex-wrap justify-center space-x-1">
                    <div className="flex items-center justify-center text-sm font-medium text-gray-400">
                      Written by :
                    </div>
                    {authorDetails.map((author, idx) => (
                      <>
                        <div className="flex items-center justify-center" key={author.name}>
                          <dl className="whitespace-nowrap text-base font-bold leading-5 text-gray-700">
                            <dt className="sr-only">Name</dt>
                            <dd className="text-gray-900 dark:text-gray-100">
                              {author.name}
                              {authorDetails.length - 1 > idx &&
                                `${authorDetails.length - 2 === idx ? ' and' : ','}`}
                            </dd>
                          </dl>
                        </div>
                      </>
                    ))}
                  </div>
                </dd>
              </dl>
            </div>
          </header>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 text-xl tracking-tight text-black dark:prose-dark">
                {children}
              </div>
            </div>
            <Comments frontMatter={frontMatter} />
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/blog/${prev.slug}`}
                      className="text-primary hover:text-primary dark:hover:text-primary"
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/blog/${next.slug}`}
                      className="text-primary hover:text-primary dark:hover:text-primary"
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
