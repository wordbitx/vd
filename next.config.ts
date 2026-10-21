import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The reference site uses these paths; keep them working as aliases of our routes.
      { source: "/veterinarian-lahore", destination: "/team", permanent: false },
      { source: "/events", destination: "/pet-care-tips", permanent: false },
      { source: "/events/:slug", destination: "/pet-care-tips/:slug", permanent: false },
      { source: "/contact", destination: "/contact-vet-lahore", permanent: false },
      { source: "/blog", destination: "/pet-care-tips", permanent: false },
      { source: "/blog/:slug", destination: "/pet-care-tips/:slug", permanent: false },
      { source: "/privacy", destination: "/privacy-policy", permanent: false },
      { source: "/terms", destination: "/terms-and-conditions", permanent: false },
    ];
  },
};

export default nextConfig;
