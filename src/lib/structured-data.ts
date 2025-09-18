import { BlogPost } from '@/types/blog'

export function generateBlogPostStructuredData(post: BlogPost, baseUrl: string = 'https://blogme.dev') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
      description: post.author.bio,
      image: post.author.avatar,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BlogMe',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    url: `${baseUrl}/blog/${post.slug}`,
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.readingTime.words,
    timeRequired: `PT${Math.ceil(post.readingTime.minutes)}M`,
    inLanguage: 'en-US',
  }
}

export function generateWebsiteStructuredData(baseUrl: string = 'https://blogme.dev') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BlogMe',
    description: 'A modern, professional blog built with Next.js, TypeScript, and Tailwind CSS. Discover insights about web development, design patterns, and modern technologies.',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BlogMe',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    sameAs: [
      'https://github.com/blogme',
      'https://twitter.com/blogme',
      'https://linkedin.com/company/blogme',
    ],
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}