import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['https://mini.torounlimitedvpn.com']
  // ❌ removed: output: 'export'
};

export default withNextIntl(nextConfig);
