import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Backend-issued uploads (vendor KYC docs, logos, banners, product images)
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Common stock / demo image sources that appear in seed data
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
