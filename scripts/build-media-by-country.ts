import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const CMS_DIR = join(ROOT, "public", "legacy", "webflow-cms");
const IMG_MANIFEST = join(ROOT, "public", "legacy", "webflow-cms-images", "_manifest.json");
const OUT_DIR = join(ROOT, "lib", "data");
const OUT_FILE = join(OUT_DIR, "media-by-country.json");

type ImageRef = { fileId: string; url: string; alt: string | null };
type Photo = {
  fileId: string;
  url: string;
  alt: string | null;
  source: "country-main" | "country-other" | "blog-thumbnail" | "blog-image";
  blogTitle?: string;
  blogSlug?: string;
  blogDate?: string;
};
type CountryMedia = {
  name: string;
  slug: string;
  subtitle: string | null;
  cover: string | null;
  photoCount: number;
  photos: Photo[];
};

function pickImageRefs(value: unknown): ImageRef[] {
  if (!value) return [];
  const out: ImageRef[] = [];
  const arr = Array.isArray(value) ? value : [value];
  for (const v of arr) {
    if (v && typeof v === "object" && "fileId" in v && "url" in v) {
      const o = v as { fileId: string; url: string; alt?: string | null };
      out.push({ fileId: o.fileId, url: o.url, alt: o.alt ?? null });
    }
  }
  return out;
}

async function main() {
  const countries = JSON.parse(await readFile(join(CMS_DIR, "countries.json"), "utf8")) as {
    items: Array<{ id: string; fieldData: Record<string, unknown> }>;
  };
  const blog = JSON.parse(await readFile(join(CMS_DIR, "blog.json"), "utf8")) as {
    items: Array<{ id: string; fieldData: Record<string, unknown> }>;
  };
  const imgManifest = JSON.parse(await readFile(IMG_MANIFEST, "utf8")) as {
    images: Array<{ fileId: string; s3Url: string }>;
  };

  const s3ByFileId = new Map<string, string>();
  for (const i of imgManifest.images) s3ByFileId.set(i.fileId, i.s3Url);

  const countryNames = countries.items
    .map((c) => (c.fieldData.name as string) || "")
    .filter(Boolean);

  const result: CountryMedia[] = [];

  for (const c of countries.items) {
    const fd = c.fieldData;
    const name = fd.name as string;
    const slug = fd.slug as string;
    const subtitle = (fd.subtitle as string) ?? null;
    const photos: Photo[] = [];
    const seenFileIds = new Set<string>();

    const addPhoto = (ref: ImageRef, source: Photo["source"], blog?: { title: string; slug: string; date?: string }) => {
      if (seenFileIds.has(ref.fileId)) return;
      const s3 = s3ByFileId.get(ref.fileId);
      if (!s3) return;
      seenFileIds.add(ref.fileId);
      photos.push({
        fileId: ref.fileId,
        url: s3,
        alt: ref.alt,
        source,
        ...(blog ? { blogTitle: blog.title, blogSlug: blog.slug, blogDate: blog.date } : {}),
      });
    };

    for (const ref of pickImageRefs(fd["main-image-s"])) addPhoto(ref, "country-main");
    for (const ref of pickImageRefs(fd["other-images"])) addPhoto(ref, "country-other");
    for (const ref of pickImageRefs(fd["carousel-image"])) addPhoto(ref, "country-main");

    for (const post of blog.items) {
      const pf = post.fieldData;
      const title = (pf.name as string) || "";
      if (!title.toLowerCase().includes(name.toLowerCase())) continue;
      const blogSlug = (pf.slug as string) || "";
      const date = (pf.date as string) || undefined;
      for (const ref of pickImageRefs(pf.thumbnail)) addPhoto(ref, "blog-thumbnail", { title, slug: blogSlug, date });
      for (const ref of pickImageRefs(pf.images)) addPhoto(ref, "blog-image", { title, slug: blogSlug, date });
    }

    photos.sort((a, b) => {
      const sourceOrder: Record<Photo["source"], number> = {
        "country-main": 0,
        "country-other": 1,
        "blog-thumbnail": 2,
        "blog-image": 2,
      };
      const sa = sourceOrder[a.source];
      const sb = sourceOrder[b.source];
      if (sa !== sb) return sa - sb;
      if (a.blogDate && b.blogDate) return b.blogDate.localeCompare(a.blogDate);
      return 0;
    });

    const cover = photos[0]?.url ?? null;

    result.push({ name, slug, subtitle, cover, photoCount: photos.length, photos });
  }

  result.sort((a, b) => b.photoCount - a.photoCount);

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(result, null, 2));

  console.log(`Wrote ${OUT_FILE}`);
  console.log(`Countries: ${result.length}`);
  console.log(`${"Country".padEnd(20)} ${"Photos".padStart(7)}  ${"Cover".padEnd(8)}`);
  console.log("-".repeat(50));
  for (const c of result) {
    console.log(`${c.name.padEnd(20)} ${String(c.photoCount).padStart(7)}  ${c.cover ? "yes" : "—"}`);
  }
  const total = result.reduce((n, c) => n + c.photoCount, 0);
  console.log("-".repeat(50));
  console.log(`Total photos across countries: ${total}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
