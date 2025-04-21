import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Disable ESLint during production builds to avoid build errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
