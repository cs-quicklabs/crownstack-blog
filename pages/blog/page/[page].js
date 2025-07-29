import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import ListLayout from '@/layouts/ListLayout'

export const POSTS_PER_PAGE = 25

export async function getStaticPaths() {
  const posts = await getAllFilesFrontMatter('blog')
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
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

  const pageNumber = parseInt(params?.page || '1')
  const initialDisplayPosts = postsWithAuthors.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(postsWithAuthors.length / POSTS_PER_PAGE),
  }

  return {
    props: {
      posts: postsWithAuthors,
      initialDisplayPosts,
      pagination,
    },
  }
}

export default function PostPage({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
