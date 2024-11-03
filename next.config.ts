import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // https://nextjs.org/docs/advanced-features/output-file-tracing
  output: 'export',

  experimental: {
    // https://nextjs.org/docs/canary/app/api-reference/next-config-js/reactCompiler
    reactCompiler: true,
    turbo: {
      moduleIdStrategy: 'deterministic',
    },
  },

  images: { unoptimized: true },

  // if set, urls like '/about' will redirect to '/about/'
  trailingSlash: true,
}

export default nextConfig
