/** @type {import('next').NextConfig} */
//
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'd1muf25xaso8hp.cloudfront.net',
      'techmoran.com',
      'constructn-projects.s3.ap-south-1.amazonaws.com',
      'constructn-attachments.s3.ap-south-1.amazonaws.com',
      'dl.airtable.com',
      'images.unsplash.com',
      'constructn-projects-dev.s3.ap-south-1.amazonaws.com',
      'constructn-attachments-dev.s3.ap-south-1.amazonaws.com',
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
