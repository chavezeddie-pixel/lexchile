/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@lexchile/database'],
  output: 'standalone',
}

module.exports = nextConfig
