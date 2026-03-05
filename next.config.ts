import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'aamgbqoyymmhhofnckat.supabase.co', // Assuming a default Supabase project format might be needed later, though not explicitly required by error
      },
    ],
  },
};

export default nextConfig;
