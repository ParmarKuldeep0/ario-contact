// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ remove "next export" script, use this instead:
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;   // ✅ for .mjs
