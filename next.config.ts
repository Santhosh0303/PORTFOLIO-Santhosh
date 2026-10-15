import type { NextConfig } from "next";

// Static export: every page is pre-built; the Worker serves the files and the API.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;
