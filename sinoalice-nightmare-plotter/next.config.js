/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  experimental: {
    outputStandalone: true,
  },
  webpack: (config, options) => {
    config.plugins.push(
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
              console.log(".. Run after build test")
          });
        }
      }    
    )
    return config
  },
}