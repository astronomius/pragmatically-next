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

    // Stops Next.js from aggressively loading all page modules into RAM at startup
    preloadEntriesOnStart: false,

    // Limits Webpack's build memory caching footprint
    webpackMemoryOptimizations: true,

    // Caches fetch responses instead of completely re-rendering on every HMR save
    serverComponentsHmrCache: true,

  },
};

export default nextConfig;
