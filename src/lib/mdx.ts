import { compile } from '@mdx-js/mdx'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { TableOfContentsItem } from '@/types/blog'

export async function serializeMDX(source: string): Promise<MDXRemoteSerializeResult> {
  return await serialize(source, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
      development: process.env.NODE_ENV === 'development',
    },
  })
}

export function generateTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const toc: TableOfContentsItem[] = []
  const stack: TableOfContentsItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = slugify(title)

    const item: TableOfContentsItem = {
      id,
      title,
      level,
      children: [],
    }

    // Find the correct parent
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop()
    }

    if (stack.length === 0) {
      toc.push(item)
    } else {
      const parent = stack[stack.length - 1]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
    }

    stack.push(item)
  }

  return toc
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function addIdsToHeadings(content: string): string {
  return content.replace(
    /^(#{1,6})\s+(.+)$/gm,
    (match, hashes, title) => {
      const id = slugify(title.trim())
      return `${hashes} ${title.trim()} {#${id}}`
    }
  )
}