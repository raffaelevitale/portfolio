import type { NextConfig } from "next";

/** Host da cui arrivano le immagini dei servizi live (copertine, giochi, locandine, avatar). */
const LIVE_IMAGE_HOSTS = [
  "i.scdn.co",
  "cdn.cloudflare.steamstatic.com",
  "shared.akamai.steamstatic.com",
  "a.ltrbxd.com",
  "avatars.githubusercontent.com",
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: LIVE_IMAGE_HOSTS.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
};

export default nextConfig;
