import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ['https://fd6a-212-45-81-45.ngrok-free.app'],    
};

export default withNextIntl(nextConfig);
