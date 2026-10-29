import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const config: NextConfig = {
  distDir: process.env.ENABLE_FRAMEWORK_PREVIEW === "1" ? ".next-framework" : ".next",
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
};

export default config;
