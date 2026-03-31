import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_REGION: process.env.S3_REGION,
    APP_AWS_REGION: process.env.APP_AWS_REGION,
    CLOUDFRONT_DOMAIN: process.env.CLOUDFRONT_DOMAIN,
  },
};

export default nextConfig;
