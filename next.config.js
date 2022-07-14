/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "source.unsplash.com",
      "englishmatee0e7a514d3df4b3cb14432f7761f2045153554-dev.s3.ap-northeast-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
