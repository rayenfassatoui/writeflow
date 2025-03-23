/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Dangerously ignore TypeScript errors from route files
    ignoreBuildErrors: true,
  },
  // Disable static export to avoid _not-found page issues
  output: 'standalone',
  poweredByHeader: false,
  // Updated experimental options
  experimental: {
    workerThreads: false,
    cpus: 1,
    optimizeCss: false,
    optimizePackageImports: ['lucide-react']
  },
  // External packages configuration
  serverExternalPackages: []
}

module.exports = nextConfig 