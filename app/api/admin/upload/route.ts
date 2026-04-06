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

// Generate a presigned URL for direct browser-to-S3 upload
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  // JSON request: generate presigned URL
  if (contentType.includes("application/json")) {
    const { filename, contentType: fileType } = await request.json();

    if (!filename || !fileType) {
      return Response.json(
        { error: "filename and contentType are required" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(fileType)) {
      return Response.json(
        { error: "File type not allowed. Use JPEG, PNG, WebP, GIF, or SVG." },
        { status: 400 }
      );
    }

    const key = `images/${Date.now()}-${sanitizeFilename(filename)}`;

    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: fileType,
      });
      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

      const publicUrl = CDN_DOMAIN
        ? `https://${CDN_DOMAIN}/${key}`
        : `https://${BUCKET}.s3.amazonaws.com/${key}`;

      return Response.json({ uploadUrl, publicUrl, key });
    } catch (error) {
      console.error("Failed to generate presigned URL:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      return Response.json(
        { error: `Failed to generate upload URL: ${message}` },
        { status: 500 }
      );
    }
  }

  // FormData upload: server-side S3 upload (fallback for small files)
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "File type not allowed. Use JPEG, PNG, WebP, GIF, or SVG." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: "File must be under 10MB" }, { status: 400 });
    }

    const key = `images/${Date.now()}-${sanitizeFilename(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const publicUrl = CDN_DOMAIN
        ? `https://${CDN_DOMAIN}/${key}`
        : `https://${BUCKET}.s3.amazonaws.com/${key}`;

      return Response.json({ publicUrl, key });
    } catch (error) {
      console.error("Failed to upload to S3:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      return Response.json(
        { error: `Upload failed: ${message}` },
        { status: 500 }
      );
    }
  }

  return Response.json({ error: "Invalid request" }, { status: 400 });
}
