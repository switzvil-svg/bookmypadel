import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

// Wires Cloudflare bindings (D1, R2) into `next dev` so getCloudflareContext() works locally
// without needing `wrangler dev` — only active when actually running under Next's dev server.
initOpenNextCloudflareForDev();
