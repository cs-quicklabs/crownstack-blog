import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link legacyBehavior href={`/tags/${kebabCase(text)}`}>
      <a className="mr-3 text-sm font-medium uppercase text-primary hover:text-primary dark:hover:text-primary">
        {text.split(' ').join('-')}
      </a>
    </Link>
  )
}

export default Tag
