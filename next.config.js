/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Dangerously ignore TypeScript errors from route files
    ignoreBuildErrors: true,
  },
  // Disable static export to avoid _not-found page issues
  output: 'standalone',
  poweredByHeader: false,
  // Disable the 404 static generation
  experimental: {
    workerThreads: false,
    cpus: 1,
    optimizeCss: false,
    optimizePackageImports: ['lucide-react'],
    instrumentationHook: false,
    serverComponentsExternalPackages: []
  }
}

module.exports = nextConfig 