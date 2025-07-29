import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import AuthorLayout from '@/layouts/AuthorLayout'

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
  const { name } = authorDetails

  return (
    <>
      <PageSEO
        title={`Posts by ${name} - ${siteMetadata.author}`}
        description={`Blog posts written by ${name}`}
      />

      <AuthorLayout frontMatter={authorDetails} layout="centered" showSEO={false} imageSize="large">
        <ListLayout posts={posts} title={`Posts by ${name}`} initialDisplayPosts={posts} />
      </AuthorLayout>
    </>
  )
}
