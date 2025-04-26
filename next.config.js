const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unavatar.io',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'favicone.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  rewrites: async () => {
    return [
      {
        source: "/api/data/:match*",
        destination: 'https://tomasmaillo.com/_vercel/insights/:match*',
      },
      {
        source: "/api/performance/:match*",
        destination: 'https://tomasmaillo.com/_vercel/speed-insights/:match*',
      },
    ]
  },
}

module.exports = withMDX(nextConfig)