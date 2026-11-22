/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.PAGES_EXPORT === 'true' && {
    output: 'export',
    trailingSlash: true,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  }),
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    unoptimized: process.env.PAGES_EXPORT === 'true',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
