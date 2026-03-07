import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Turbopack only used in local dev, not needed for Vercel build
};

export default nextConfig;
