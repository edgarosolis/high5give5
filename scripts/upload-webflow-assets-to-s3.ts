import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const BUCKET = process.env.S3_BUCKET ?? "high5give5-uploads";
const PREFIX = process.env.S3_PREFIX ?? "legacy/webflow";
const REGION = process.env.AWS_REGION ?? "us-east-1";
const SRC_DIR = join(process.cwd(), "public", "legacy", "webflow-assets");
const MANIFEST_PATH = join(SRC_DIR, "_manifest.json");

const s3 = new S3Client({ region: REGION });

type ManifestAsset = {
  id: string;
  file: string;
  originalFileName: string;
  displayName: string;
  contentType: string;
  size: number;
  createdOn: string;
  lastUpdated: string;
  hostedUrl: string;
  s3Key?: string;
  s3Url?: string;
};

type Manifest = {
  siteId: string;
  downloadedAt: string;
  count: number;
  succeeded: number;
  failed: number;
  errors: unknown[];
  assets: ManifestAsset[];
  s3?: { bucket: string; prefix: string; uploadedAt: string; region: string };
};

async function objectExists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadOne(
  asset: ManifestAsset
): Promise<{ ok: boolean; key: string; error?: string }> {
  const key = `${PREFIX}/${asset.file}`;
  const filePath = join(SRC_DIR, asset.file);

  if (await objectExists(key)) return { ok: true, key };

  const body = await readFile(filePath);
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: asset.contentType,
        Metadata: {
          "webflow-id": asset.id,
          "original-filename": asset.originalFileName,
          "webflow-created": asset.createdOn,
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
    `Uploading ${manifest.assets.length} assets to s3://${BUCKET}/${PREFIX}/ (${REGION})`
  );

  let done = 0;
  let failed = 0;
  const errors: Array<{ id: string; file: string; error: string }> = [];

  const concurrency = 8;
  for (let i = 0; i < manifest.assets.length; i += concurrency) {
    const batch = manifest.assets.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(uploadOne));
    results.forEach((r, idx) => {
      const a = batch[idx];
      if (r.ok) {
        a.s3Key = r.key;
        a.s3Url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${r.key}`;
        done++;
      } else {
        failed++;
        errors.push({ id: a.id, file: a.file, error: r.error ?? "unknown" });
      }
    });
    process.stdout.write(`\r  ${done + failed}/${manifest.assets.length} (${failed} failed)`);
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
    console.log("Errors:");
    errors.slice(0, 10).forEach((e) => console.log(`  ${e.file}: ${e.error}`));
  }
  console.log(`Manifest updated with s3Key/s3Url for each asset.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
