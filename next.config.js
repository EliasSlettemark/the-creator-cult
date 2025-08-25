const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.tailwindcss.com",
        pathname: "/templates/compass/**",
      },
      {
        protocol: "https",
        hostname: "image-useast2a.tiktokv.com",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      }
    ],
  },
};

module.exports = withMDX(nextConfig);