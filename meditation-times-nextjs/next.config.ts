/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "placehold.co" },
    ],
    domains: [
      'lh3.googleusercontent.com', // Google user content
    ]
  },
  experimental: {
    optimizeFonts: {
      preload: false
    }
  }
};

module.exports = nextConfig;