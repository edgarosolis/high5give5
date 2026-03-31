import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.S3_REGION || process.env.APP_AWS_REGION || process.env.AWS_REGION || "us-east-1",
});

const BUCKET = process.env.S3_BUCKET_NAME || "high5give5-uploads";
const CDN_DOMAIN = process.env.CLOUDFRONT_DOMAIN || "";

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  const { filename, contentType } = await request.json();

  if (!filename || !contentType) {
    return Response.json(
      { error: "filename and contentType are required" },
      { status: 400 }
    );
  }

  // Validate content type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowedTypes.includes(contentType)) {
    return Response.json(
      { error: "File type not allowed. Use JPEG, PNG, WebP, GIF, or SVG." },
      { status: 400 }
    );
  }

  const key = `images/${Date.now()}-${sanitizeFilename(filename)}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  // Public URL: prefer CloudFront if configured, else use S3 URL
  const publicUrl = CDN_DOMAIN
    ? `https://${CDN_DOMAIN}/${key}`
    : `https://${BUCKET}.s3.amazonaws.com/${key}`;

  return Response.json({ uploadUrl, publicUrl, key });
}
