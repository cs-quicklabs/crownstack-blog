import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'

export const POSTS_PER_PAGE = 25

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  // Load author details for each post
  const postsWithAuthors = await Promise.all(
    posts.map(async (post) => {
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

  const initialDisplayPosts = postsWithAuthors.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(postsWithAuthors.length / POSTS_PER_PAGE),
  }

  return { props: { initialDisplayPosts, posts: postsWithAuthors, pagination } }
}

export default function Blog({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
