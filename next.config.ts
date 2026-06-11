import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone',
  cacheComponents: true,
  experimental: {
    viewTransition: true,
    instantNavigationDevToolsToggle: true,
  },
};

export default nextConfig;
