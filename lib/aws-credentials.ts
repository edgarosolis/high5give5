import { awsCredentialsProvider } from "@vercel/functions/oidc";

// On Vercel, assume the IAM role via OIDC federation (no static keys).
// Anywhere else (Amplify, local with AWS profile) fall back to the SDK
// default credential chain by returning undefined.
export function awsCredentials() {
  if (process.env.VERCEL && process.env.AWS_ROLE_ARN) {
    return awsCredentialsProvider({ roleArn: process.env.AWS_ROLE_ARN });
  }
  return undefined;
}
