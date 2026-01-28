const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  // Improve development experience
  onDemandEntries: {
    // Keep pages in memory for longer (in ms)
    maxInactiveAge: 60 * 1000,
    // Number of pages to keep in memory
    pagesBufferLength: 5,
  },
  // Faster refresh in development
  reactStrictMode: true,
  // Turbopack configuration
  turbopack: {
    root: __dirname,
  },
  // Experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['framer-motion', '@tanstack/react-query'],
  },
};

module.exports = nextConfig;
