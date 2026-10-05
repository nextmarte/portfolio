import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "baxijen.com.br",
      },
      {
        protocol: "https",
        hostname: "www.baxijen.com.br",
      },
    ],
  },
};

export default nextConfig;
