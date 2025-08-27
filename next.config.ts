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
      {
        protocol: 'https',
        hostname: 'luxmarket.app',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
    domains: ['luxapp.biz','luxmarket.app'], // Alternative way, but remotePatterns is preferred
  },
  // Enable experimental features if needed
  experimental: {
    turbo: {
      rules: {},
    },
  },
};

module.exports = nextConfig;