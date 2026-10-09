import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost:3001", "localhost:3000"],
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
