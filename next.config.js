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
    ],
  },
};

module.exports = withMDX(nextConfig);