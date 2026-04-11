import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/interfaccia',
        destination: '/interfaccia/index.html',
      },
    ];
  },
};

export default nextConfig;
