import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Allow dangerouslySetInnerHTML for prose content rendered server-side
  experimental: {},
};

export default nextConfig;
