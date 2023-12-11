/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["tbw-dpm.s3.amazonaws.com", "picsum.photos"],
  },
};
