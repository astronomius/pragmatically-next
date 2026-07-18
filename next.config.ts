import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone',
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    viewTransition: true,
    instantNavigationDevToolsToggle: true,
  },
};

export default nextConfig;
