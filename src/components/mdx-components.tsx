"use client"

import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"
import { Copy, ExternalLink } from "lucide-react"

const components = {
  h1: ({ children, ...props }: { children: ReactNode }) => (
    <h1 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-8 leading-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: { children: ReactNode }) => (
    <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-12 mb-6 leading-tight" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: { children: ReactNode }) => (
    <h3 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-10 mb-4 leading-tight" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: { children: ReactNode }) => (
    <h4 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-8 mb-3 leading-tight" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: { children: ReactNode }) => (
    <h5 className="text-lg sm:text-xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-6 mb-2 leading-tight" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: { children: ReactNode }) => (
    <h6 className="text-base sm:text-lg font-bold font-serif text-gray-900 dark:text-gray-100 mt-4 mb-2 leading-tight" {...props}>
      {children}
    </h6>
  ),
  p: ({ children, ...props }: { children: ReactNode }) => (
    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }: { href?: string; children: ReactNode }) => {
    const isExternal = href?.startsWith('http')
    const linkClasses = "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-2 decoration-primary-300 hover:decoration-primary-500 transition-colors"

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkClasses} inline-flex items-center gap-1`}
          {...props}
        >
          {children}
          <ExternalLink className="w-3 h-3" />
        </a>
      )
    }

    return (
      <Link href={href || '#'} className={linkClasses} {...props}>
        {children}
      </Link>
    )
  },
  ul: ({ children, ...props }: { children: ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 mb-6 text-lg text-gray-700 dark:text-gray-300 pl-4" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: { children: ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 mb-6 text-lg text-gray-700 dark:text-gray-300 pl-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: { children: ReactNode }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-primary-500 pl-6 py-2 my-8 italic text-lg text-gray-700 dark:text-gray-300 bg-primary-50 dark:bg-primary-900/20 rounded-r-lg" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }: { children: ReactNode; className?: string }) => {
    if (className?.includes('language-')) {
      // This is a code block
      return (
        <div className="relative group">
          <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed border border-gray-200 dark:border-gray-700 my-6" {...props}>
            <code className={className}>{children}</code>
          </pre>
          <button
            onClick={() => navigator.clipboard?.writeText(String(children))}
            className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      )
    }

    // Inline code
    return (
      <code className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded-md text-sm font-mono" {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: { children: ReactNode }) => (
    <div className="relative group">
      <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed border border-gray-200 dark:border-gray-700 my-6" {...props}>
        {children}
      </pre>
    </div>
  ),
  img: ({ src, alt, ...props }: { src?: string; alt?: string }) => (
    <div className="my-8">
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={400}
        className="rounded-xl shadow-medium border border-gray-200 dark:border-gray-700 w-full h-auto"
        {...props}
      />
      {alt && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
          {alt}
        </p>
      )}
    </div>
  ),
  table: ({ children, ...props }: { children: ReactNode }) => (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: { children: ReactNode }) => (
    <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: { children: ReactNode }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: { children: ReactNode }) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700" {...props}>
      {children}
    </td>
  ),
  hr: (props: any) => (
    <hr className="my-12 border-gray-200 dark:border-gray-700" {...props} />
  ),
  strong: ({ children, ...props }: { children: ReactNode }) => (
    <strong className="font-bold text-gray-900 dark:text-gray-100" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: { children: ReactNode }) => (
    <em className="italic text-gray-800 dark:text-gray-200" {...props}>
      {children}
    </em>
  ),
}

export default components