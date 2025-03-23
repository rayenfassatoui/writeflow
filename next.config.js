/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    // Dangerously ignore TypeScript errors from route files
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static export to avoid _not-found page issues
  output: 'standalone',
  poweredByHeader: false,
  // Updated experimental options
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  // External packages configuration
  serverExternalPackages: []
}

module.exports = nextConfig 