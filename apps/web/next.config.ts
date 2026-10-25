import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@modoltracker/core',
    '@modoltracker/api-client',
    '@modoltracker/ui',
    '@modoltracker/db-types',
    '@modoltracker/config',
  ],
};

export default nextConfig;
