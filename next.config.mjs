/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      "swr": "swr",
      "swr/infinite": "swr/infinite",
      "swr/mutation": "swr/mutation",
    },
  },
};

export default nextConfig;