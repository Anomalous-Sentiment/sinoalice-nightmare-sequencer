/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  experimental: {
    outputStandalone: true,
  },
  images: {
    domains: ['sinoalice.game-db.tw'],
  },
}