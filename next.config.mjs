/**
 * Static export so the app runs on GitHub Pages or any static host
 * (e.g. InfinityFree — just upload the `out/` folder).
 * NEXT_PUBLIC_BASE_PATH is set automatically by the GitHub Actions workflow
 * to "/<repo-name>" so assets resolve correctly on username.github.io/<repo-name>.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
