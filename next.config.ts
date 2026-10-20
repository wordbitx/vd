import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // node:sqlite is a Node.js builtin (22+) that bundlers don't know yet —
  // always resolve it at runtime from the Node runtime itself.
  serverExternalPackages: ["node:sqlite"],
};

export default nextConfig;
