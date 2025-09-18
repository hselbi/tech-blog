import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BlogMe - Modern Developer Blog',
    short_name: 'BlogMe',
    description: 'A modern, professional blog built with Next.js, TypeScript, and Tailwind CSS. Featuring MDX support, dark mode, and responsive design.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['blogs', 'development', 'technology'],
    lang: 'en',
    orientation: 'portrait-primary',
  }
}