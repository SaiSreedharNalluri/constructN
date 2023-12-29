/** @type {import('next').NextConfig} */
//
const { withSentryConfig } = require("@sentry/nextjs");

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
      {
        source: "/",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date" },
                
        ],
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
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
    hideSourceMaps: true,
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring-tunnel",
    autoInstrumentServerFunctions: false,
    excludeServerRoutes: [
      "/some/excluded/route",
      "/excluded/route/with/[parameter]",
      /^\/route\/beginning\/with\/some\/prefix/,
      /\/routeContainingASpecificPathSegment\/?/,
    ],
    autoInstrumentMiddleware: false,
    automaticVercelMonitors: false,
    // See the sections below for information on the following options:
    //   'Configure Source Maps':
    //     - disableServerWebpackPlugin
    //     - disableClientWebpackPlugin
    //     - hideSourceMaps
    //     - widenClientFileUpload
    //   'Configure Legacy Browser Support':
    //     - transpileClientSDK
    //   'Configure Serverside Auto-instrumentation':
    //     - autoInstrumentServerFunctions
    //     - excludeServerRoutes
    //   'Configure Tunneling to avoid Ad-Blockers':
    //     - tunnelRoute
  },
};
module.exports =withSentryConfig( nextConfig);
