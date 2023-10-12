import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import NewsletterListLayout from '@/layouts/NewsletterListLayout'

export const POSTS_PER_PAGE = 25

export async function getStaticProps() {
  const newsletters = await getAllFilesFrontMatter('newsletters')
  const initialDisplayNewsletters = newsletters.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(newsletters.length / POSTS_PER_PAGE),
  }
  return { props: { initialDisplayNewsletters, newsletters, pagination } }
}

export default function Newsletter({ newsletters, initialDisplayNewsletters, pagination }) {
  return (
    <>
      <PageSEO
        title={`Newsletter - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <NewsletterListLayout
        newsletters={newsletters}
        initialDisplayNewsletters={initialDisplayNewsletters}
        pagination={pagination}
        title="Newsletters"
      />
    </>
  )
}
