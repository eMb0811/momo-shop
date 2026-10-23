import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  // Autorise l'accès au serveur de dev depuis le réseau local (téléphone, autre PC…)
  allowedDevOrigins: ['192.168.1.6', '192.168.*.*'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
