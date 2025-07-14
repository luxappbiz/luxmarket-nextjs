import type { NextConfig } from "next";

const nextConfig:NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'luxapp.biz',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
    domains: ['luxapp.biz'], // Alternative way, but remotePatterns is preferred
  },
  // Enable experimental features if needed
  experimental: {
    turbo: {
      rules: {},
    },
  },
};

module.exports = nextConfig;