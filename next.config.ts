import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "luxapp.biz",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "luxmarket.app",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  turbopack: {
    rules: {},
  },
};

export default nextConfig;
