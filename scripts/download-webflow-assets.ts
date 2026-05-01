import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname } from "node:path";

const TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID ?? "62b34d428b67bb250e35007e";
const OUT_DIR = join(process.cwd(), "public", "legacy", "webflow-assets");
const API = "https://api.webflow.com/v2";

if (!TOKEN) {
  console.error("Missing WEBFLOW_TOKEN env var");
  process.exit(1);
}

type Asset = {
  id: string;
  contentType: string;
  size: number;
  hostedUrl: string;
  originalFileName: string;
  displayName: string;
  createdOn: string;
  lastUpdated: string;
  variants?: Array<{ hostedUrl: string; originalFileName: string }>;
};

async function listAllAssets(): Promise<Asset[]> {
  const all: Asset[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const url = `${API}/sites/${SITE_ID}/assets?limit=${limit}&offset=${offset}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "accept-version": "2.0.0",
      },
    });
    if (!res.ok) {
      throw new Error(`List assets failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as { assets: Asset[]; pagination?: { total: number } };
    all.push(...data.assets);
    console.log(`  fetched ${all.length}${data.pagination ? ` / ${data.pagination.total}` : ""}`);
    if (data.assets.length < limit) break;
    offset += limit;
  }
  return all;
}

function safeName(asset: Asset): string {
  const original = asset.originalFileName || asset.displayName || `${asset.id}`;
  const cleaned = original.replace(/[^\w.\-]/g, "_");
  return `${asset.id}__${cleaned}${extname(cleaned) ? "" : guessExt(asset.contentType)}`;
}

function guessExt(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
    "video/mp4": ".mp4",
    "application/pdf": ".pdf",
  };
  return map[contentType] ?? "";
}

async function downloadOne(asset: Asset): Promise<{ ok: boolean; path: string; error?: string }> {
  const filename = safeName(asset);
  const path = join(OUT_DIR, filename);
  if (existsSync(path)) return { ok: true, path };

  const res = await fetch(asset.hostedUrl);
  if (!res.ok) return { ok: false, path, error: `${res.status} ${res.statusText}` };
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path, buf);
  return { ok: true, path };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Listing assets for site ${SITE_ID}…`);
  const assets = await listAllAssets();
  console.log(`Found ${assets.length} assets. Downloading to ${OUT_DIR}`);

  let done = 0;
  let failed = 0;
  const errors: Array<{ id: string; name: string; error: string }> = [];

  const concurrency = 8;
  for (let i = 0; i < assets.length; i += concurrency) {
    const batch = assets.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(downloadOne));
    results.forEach((r, idx) => {
      const a = batch[idx];
      if (r.ok) {
        done++;
      } else {
        failed++;
        errors.push({ id: a.id, name: a.originalFileName, error: r.error ?? "unknown" });
      }
    });
    process.stdout.write(`\r  ${done + failed}/${assets.length} (${failed} failed)`);
  }
  process.stdout.write("\n");

  await writeFile(
    join(OUT_DIR, "_manifest.json"),
    JSON.stringify(
      {
        siteId: SITE_ID,
        downloadedAt: new Date().toISOString(),
        count: assets.length,
        succeeded: done,
        failed,
        errors,
        assets: assets.map((a) => ({
          id: a.id,
          file: safeName(a),
          originalFileName: a.originalFileName,
          displayName: a.displayName,
          contentType: a.contentType,
          size: a.size,
          createdOn: a.createdOn,
          lastUpdated: a.lastUpdated,
          hostedUrl: a.hostedUrl,
        })),
      },
      null,
      2
    )
  );

  console.log(`Done. ${done} succeeded, ${failed} failed.`);
  console.log(`Manifest: ${join(OUT_DIR, "_manifest.json")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
