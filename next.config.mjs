/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true },
  ...(isExport
    ? {
        output: 'export',
        basePath: basePath,
        assetPrefix: basePath ? `${basePath}/` : undefined,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
