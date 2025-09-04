import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: false,
    // Provide sizes we intend to request from the optimizer for faster previews
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 400, 512, 800, 1024],
  },
  async headers() {
    return [
      {
        // Cache public images aggressively (update filenames to bust cache when changing assets)
        source: "/:all*(png|jpg|jpeg|webp|svg|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Ensure Next static assets are cached
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
