import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site tamamen statik üretilir; `out/` klasörü herhangi bir sunucuya yüklenebilir.
  output: "export",
  // GitHub Pages önizlemesi alt dizinde yayınlanır (bkz. `npm run build:pages`)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
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
