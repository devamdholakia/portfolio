import type { NextConfig } from 'next'

// fully static site, Vercel serves the exported /out folder
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
}

export default nextConfig
