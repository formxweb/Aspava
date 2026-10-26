import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site tamamen statik üretilir; `out/` klasörü herhangi bir sunucuya yüklenebilir.
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
