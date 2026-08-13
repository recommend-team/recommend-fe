import type { NextConfig } from "next";
import { OPTIMISED_IMAGE_HOSTS } from "./src/lib/imageHosts";

const nextConfig: NextConfig = {
  images: {
    // Built from the shared list so the optimiser and `RemoteImage` can never disagree.
    remotePatterns: OPTIMISED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
