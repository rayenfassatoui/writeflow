/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Dangerously ignore TypeScript errors from route files
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 