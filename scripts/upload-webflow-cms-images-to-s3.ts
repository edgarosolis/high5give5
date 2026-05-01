import { readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const BUCKET = process.env.S3_BUCKET ?? "high5give5-uploads";
const PREFIX = process.env.S3_PREFIX ?? "legacy/webflow-cms";
const REGION = process.env.AWS_REGION ?? "us-east-1";
const SRC_DIR = join(process.cwd(), "public", "legacy", "webflow-cms-images");
const MANIFEST_PATH = join(SRC_DIR, "_manifest.json");

const s3 = new S3Client({ region: REGION });

type Image = {
  fileId: string;
  file: string;
  originalUrl: string;
  usages: Array<{ collection: string; itemId: string; field: string; alt: string | null }>;
  s3Key?: string;
  s3Url?: string;
};

type Manifest = {
  downloadedAt: string;
  totalRefs: number;
  uniqueCount: number;
  succeeded: number;
  failed: number;
  errors: unknown[];
  images: Image[];
  s3?: { bucket: string; prefix: string; uploadedAt: string; region: string };
};

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

async function objectExists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadOne(img: Image): Promise<{ ok: boolean; key: string; error?: string }> {
  const key = `${PREFIX}/${img.file}`;
  const filePath = join(SRC_DIR, img.file);
  if (await objectExists(key)) return { ok: true, key };

  const ext = extname(img.file).toLowerCase();
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

  try {
    const body = await readFile(filePath);
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        Metadata: {
          "webflow-file-id": img.fileId,
          "webflow-original-url": img.originalUrl,
        },
      })
    );
    return { ok: true, key };
  } catch (err) {
    return { ok: false, key, error: (err as Error).message };
  }
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8")) as Manifest;
  console.log(
    `Uploading ${manifest.images.length} CMS images to s3://${BUCKET}/${PREFIX}/ (${REGION})`
  );

  let done = 0;
  let failed = 0;
  const errors: Array<{ fileId: string; file: string; error: string }> = [];

  const concurrency = 12;
  for (let i = 0; i < manifest.images.length; i += concurrency) {
    const batch = manifest.images.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(uploadOne));
    results.forEach((r, idx) => {
      const img = batch[idx];
      if (r.ok) {
        img.s3Key = r.key;
        img.s3Url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${r.key}`;
        done++;
      } else {
        failed++;
        errors.push({ fileId: img.fileId, file: img.file, error: r.error ?? "unknown" });
      }
    });
    process.stdout.write(`\r  ${done + failed}/${manifest.images.length} (${failed} failed)`);
  }
  process.stdout.write("\n");

  manifest.s3 = {
    bucket: BUCKET,
    prefix: PREFIX,
    uploadedAt: new Date().toISOString(),
    region: REGION,
  };

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Done. ${done} succeeded, ${failed} failed.`);
  if (errors.length) {
    console.log("First errors:");
    errors.slice(0, 10).forEach((e) => console.log(`  ${e.file}: ${e.error}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
