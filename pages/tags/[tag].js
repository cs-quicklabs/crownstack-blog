import { TagSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import generateRss from '@/lib/generate-rss'
import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'
import fs from 'fs'
import path from 'path'

const root = process.cwd()

export async function getStaticPaths() {
  const tags = await getAllTags('blog')

  return {
    paths: Object.keys(tags).map((tag) => ({
      params: {
        tag,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllFilesFrontMatter('blog')

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

  const filteredPosts = postsWithAuthors.filter((post) => {
    const tagSlugs = post.tags.map((tag) => kebabCase(tag))
    return tagSlugs.includes(params.tag)
  })

  // rss
  if (filteredPosts.length > 0) {
    const rss = generateRss(filteredPosts, `tags/${params.tag}/feed.xml`)
    const rssPath = path.join(root, 'public', 'tags', params.tag)
    fs.mkdirSync(rssPath, { recursive: true })
    fs.writeFileSync(path.join(rssPath, 'feed.xml'), rss)
  }

  return { props: { posts: filteredPosts, tag: params.tag } }
}

export default function Tag({ posts, tag }) {
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  return (
    <>
      <TagSEO
        title={`${tag} - ${siteMetadata.author}`}
        description={`${tag} tags - ${siteMetadata.author}`}
      />
      <ListLayout posts={posts} title={title} />
    </>
  )
}
