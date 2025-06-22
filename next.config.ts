import type { NextConfig } from 'next';
const BUILD_ID = new Date().getTime();

const nextConfig: NextConfig = {
  output: 'standalone',

  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  generateBuildId: () => BUILD_ID.toString(),
};

export default nextConfig;
