import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Initialize the Next-Intl plugin (will auto-load next-intl.config.ts)
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // any other Next.js settings you need
};

export default withNextIntl(nextConfig);
