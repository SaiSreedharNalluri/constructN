/** @type {import('next').NextConfig} */
//
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "d1muf25xaso8hp.cloudfront.net",
      "techmoran.com",
      "constructn-projects.s3.ap-south-1.amazonaws.com",
      "constructn-attachments.s3.ap-south-1.amazonaws.com",
      "dl.airtable.com",
      "images.unsplash.com",
      "constructn-projects-dev.s3.ap-south-1.amazonaws.com",
      "constructn-attachments-dev.s3.ap-south-1.amazonaws.com",
      "dypspyf3tih5l.cloudfront.net",
      "d2sf0c7876ryty.cloudfront.net",
      "constructn-projects-us.s3.us-west-2.amazonaws.com",
      "constructn-attachments-us.s3.us-west-2.amazonaws.com",
      "constructnai.freshdesk.com",
      "constructncorp.freshchat.com",
      "apps.apple.com",
      "ajax.googleapis.com",
    ],
  },
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "content-type", value: "application/json" }],
      },
      {
        source: "/apple-app-site-association",
        headers: [{ key: "content-type", value: "application/json" }],
      },
    ];
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/projects",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
