import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    qualities: [58, 75],
  },
  // Geetha Krishna portfolio: pages live in /site-pages (assets in public/gk) and are served
  // by the prerendered route handler at src/app/p/[...path]/route.ts.
  async redirects() {
    return [
      { source: "/mission", destination: "/about", permanent: true },
      { source: "/p/index", destination: "/", permanent: true },
      { source: "/p/:page(work|about|freelance-graphic-designer-bangalore|freelance-video-editor-bangalore)", destination: "/:page", permanent: true },
      { source: "/p/work/:slug", destination: "/work/:slug", permanent: true },
    ];
  },
  async headers() {
    // Template assets and optimised media rarely change; cache for a week, refresh in the background.
    return [
      {
        source: "/gk/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/p/index" },
        { source: "/work", destination: "/p/work" },
        { source: "/work/:slug", destination: "/p/work/:slug" },
        { source: "/about", destination: "/p/about" },
        {
          source: "/:page(freelance-graphic-designer-bangalore|freelance-video-editor-bangalore)",
          destination: "/p/:page",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
