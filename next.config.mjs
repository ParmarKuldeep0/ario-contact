/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",   // replaces old `next export`
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
