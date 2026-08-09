const withMDX = require('@next/mdx')()
const { withSentryConfig } = require('@sentry/nextjs')

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
      {
        protocol: 'https',
        hostname: '*.openlibrary.org',
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
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
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

module.exports = withSentryConfig(withMDX(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  silent: !process.env.CI,
})
