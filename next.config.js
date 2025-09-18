/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'unsplash.com',
      'cdn.pixabay.com',
      'www.notion.so',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      's3.us-west-2.amazonaws.com'
    ],
  },
}

module.exports = nextConfig