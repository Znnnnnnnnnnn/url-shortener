/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/list",
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
