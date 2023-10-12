/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.sandbox.game',
        port: '',
        pathname: '/avatars/presets/**',
      },
      {
        protocol: 'https',
        hostname: 'api.sandbox.game',
        port: '',
        pathname: '/assets/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
