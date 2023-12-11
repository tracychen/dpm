/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: false,
  images: {
    domains: ["tbw-dpm.s3.amazonaws.com", "picsum.photos"],
  },
};
