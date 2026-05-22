import type { NextConfig } from "next";

// Content-Security-Policy.
// Notes:
//   - 'unsafe-inline' for scripts is required by Next.js inline bootstrap and the
//     inline JSON-LD blocks. Next 16 does not yet emit a nonce for these.
//   - 'unsafe-inline' for styles is required by Tailwind CSS v4 and Framer Motion.
//   - connect-src lists the Cloudflare Worker, all RoProxy hosts used by hooks,
//     and Vercel Analytics / Speed Insights endpoints.
//   - img-src allows any https origin so RoProxy CDN URLs (which can rotate
//     hostnames) keep working without future churn.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://va.vercel-scripts.com",
  "connect-src 'self' https://livestatsupdate.jojocrafthdyt.workers.dev https://thumbnails.roproxy.com https://games.roproxy.com https://groups.roproxy.com https://cloudflareinsights.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
      {
        source: "/assets/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Disable Next.js image optimization for RoProxy to avoid Vercel Hobby limits
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
