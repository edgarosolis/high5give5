import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, basename } from "node:path";

const CMS_DIR = join(process.cwd(), "public", "legacy", "webflow-cms");
const OUT_DIR = join(process.cwd(), "public", "legacy", "webflow-cms-images");

type ImageRef = {
  fileId: string;
  url: string;
  alt?: string | null;
  collection: string;
  itemId: string;
  field: string;
};

function safeName(fileId: string, url: string): string {
  const tail = basename(new URL(url).pathname);
  const cleaned = decodeURIComponent(tail).replace(/[^\w.\-]/g, "_");
  const hasExt = extname(cleaned);
  return hasExt ? `${fileId}__${cleaned}` : `${fileId}__${cleaned}.jpg`;
}

function walkImages(value: unknown, out: Omit<ImageRef, "fileId" | "url" | "alt">, collected: ImageRef[]) {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach((v) => walkImages(v, out, collected));
    return;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.fileId === "string" && typeof obj.url === "string") {
      collected.push({
        fileId: obj.fileId,
        url: obj.url,
        alt: typeof obj.alt === "string" ? obj.alt : null,
        ...out,
      });
    }
  }
}

async function gatherImageRefs(): Promise<ImageRef[]> {
  const files = (await readdir(CMS_DIR)).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
  const refs: ImageRef[] = [];
  for (const f of files) {
    const data = JSON.parse(await readFile(join(CMS_DIR, f), "utf8")) as {
      collection: { slug: string; fields: Array<{ slug: string; type: string }> };
      items: Array<{ id: string; fieldData: Record<string, unknown> }>;
    };
    const imageFields = data.collection.fields
      .filter((field) => field.type === "Image" || field.type === "MultiImage")
      .map((field) => field.slug);
    for (const item of data.items) {
      for (const slug of imageFields) {
        walkImages(
          item.fieldData[slug],
          { collection: data.collection.slug, itemId: item.id, field: slug },
          refs
        );
      }
    }
  }
  return refs;
}

async function downloadOne(file: string, url: string): Promise<{ ok: boolean; error?: string }> {
  if (existsSync(file)) return { ok: true };
  const res = await fetch(url);
  if (!res.ok) return { ok: false, error: `${res.status} ${res.statusText}` };
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(file, buf);
  return { ok: true };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const allRefs = await gatherImageRefs();
  console.log(`Total image references in CMS: ${allRefs.length}`);

  const byFileId = new Map<string, ImageRef & { usages: Array<{ collection: string; itemId: string; field: string; alt: string | null }> }>();
  for (const r of allRefs) {
    const existing = byFileId.get(r.fileId);
    if (existing) {
      existing.usages.push({ collection: r.collection, itemId: r.itemId, field: r.field, alt: r.alt ?? null });
    } else {
      byFileId.set(r.fileId, {
        ...r,
        usages: [{ collection: r.collection, itemId: r.itemId, field: r.field, alt: r.alt ?? null }],
      });
    }
  }
  const unique = Array.from(byFileId.values());
  console.log(`Unique images by fileId: ${unique.length}`);
  console.log(`Downloading to ${OUT_DIR}`);

  let done = 0;
  let failed = 0;
  const errors: Array<{ fileId: string; url: string; error: string }> = [];

  const concurrency = 12;
  for (let i = 0; i < unique.length; i += concurrency) {
    const batch = unique.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (ref) => {
        const file = join(OUT_DIR, safeName(ref.fileId, ref.url));
        const result = await downloadOne(file, ref.url);
        if (result.ok) done++;
        else {
          failed++;
          errors.push({ fileId: ref.fileId, url: ref.url, error: result.error ?? "unknown" });
        }
      })
    );
    process.stdout.write(`\r  ${done + failed}/${unique.length} (${failed} failed)`);
  }
  process.stdout.write("\n");

  await writeFile(
    join(OUT_DIR, "_manifest.json"),
    JSON.stringify(
      {
        downloadedAt: new Date().toISOString(),
        totalRefs: allRefs.length,
        uniqueCount: unique.length,
        succeeded: done,
        failed,
        errors,
        images: unique.map((r) => ({
          fileId: r.fileId,
          file: safeName(r.fileId, r.url),
          originalUrl: r.url,
          usages: r.usages,
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
