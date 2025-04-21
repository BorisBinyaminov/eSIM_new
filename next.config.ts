import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable ESLint to ignore during build if needed
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; " +
                   "script-src 'self' 'unsafe-inline' https://telegram.org; " +
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                   "font-src 'self' https://fonts.gstatic.com data:; " +
                   "img-src 'self' data: https://t.me https://api.telegram.org; " +
                   "connect-src 'self' https://api.esimaccess.com; " +
                   "frame-src 'self' https://telegram.org;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
