// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // replaces "next export"
  trailingSlash: true,
  images: {
    unoptimized: true, // required for static export
  },
};

module.exports = nextConfig;
