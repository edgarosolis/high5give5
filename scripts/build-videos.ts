import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const MEDIA_JSON = join(ROOT, "public/legacy/webflow-cms/media.json");
const IMG_MANIFEST = join(ROOT, "public/legacy/webflow-cms-images/_manifest.json");
const OUT_DIR = join(ROOT, "lib/data");
const OUT_FILE = join(OUT_DIR, "videos.json");

type Provider = "youtube" | "vimeo";

type WebflowVideoItem = {
  id: string;
  isArchived: boolean;
  isDraft: boolean;
  fieldData: {
    name: string;
    slug: string;
    video?: {
      url: string;
      metadata?: {
        title?: string;
        provider_name?: string;
        thumbnail_url?: string;
        width?: number;
        height?: number;
      };
    };
    thumbnail?: { fileId?: string; url?: string; alt?: string | null } | null;
  };
};

type ManifestImage = {
  fileId: string;
  s3Url: string;
};

type Video = {
  slug: string;
  name: string;
  provider: Provider;
  videoId: string;
  embedUrl: string;
  externalUrl: string;
  thumbnail: string;
  category: string;
};

// Hand-curated category assignments. Anything not listed lands in "More Stories".
// Order of categories below = display order on the page.
const CATEGORIES: { name: string; slugs: string[] }[] = [
  {
    name: "Children's Voices",
    slugs: [
      "logans-insight-12-years-old",
      "sophie-6-years-old",
      "jillians-world-view-9-years-old",
      "sarahs-insight-on-giving",
      "sydney-10-years-old-from-singapore",
      "sophie-selling-water-in-central",
    ],
  },
  {
    name: "Kenya",
    slugs: [
      "happy-dance-in-kawangware-slum-kenya",
      "nairobi-kenya",
      "food-bags-in-kenya-slums",
      "daisy-in-kenya",
      "kids-praying-nairobi",
    ],
  },
  {
    name: "Armenia",
    slugs: [
      "food-ministry-armenia",
      "food-distribution-armenia",
      "spitak-armenia",
      "food-ministry-in-armenia",
      "elderly-in-armenia",
      "armenia-shoe-distribution",
    ],
  },
  {
    name: "Philippines",
    slugs: [
      "feeding-in-cebu-philippines",
      "feeding-aromahan-cebu-philippines",
      "feeding-program-philippines",
    ],
  },
  {
    name: "Founders & Tributes",
    slugs: [
      "in-memory-of-john-bueno",
      "introduction-by-john-bueno",
      "introduction-by-david-wilkerson",
      "bishop-tendero",
    ],
  },
  // Catch-all "More Stories" appended automatically.
];

const FALLBACK_CATEGORY = "More Stories";

function parseProvider(url: string): { provider: Provider; videoId: string } | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v");
      if (id) return { provider: "youtube", videoId: id };
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (id) return { provider: "youtube", videoId: id };
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (/^\d+$/.test(id)) return { provider: "vimeo", videoId: id };
    }
  } catch {
    return null;
  }
  return null;
}

function embedFor(provider: Provider, videoId: string): string {
  if (provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
}

async function main() {
  const mediaRaw = JSON.parse(await readFile(MEDIA_JSON, "utf8")) as {
    items: WebflowVideoItem[];
  };
  const manifestRaw = JSON.parse(await readFile(IMG_MANIFEST, "utf8")) as {
    images: ManifestImage[];
  };

  const fileIdToS3 = new Map<string, string>();
  for (const img of manifestRaw.images) fileIdToS3.set(img.fileId, img.s3Url);

  const slugToCategory = new Map<string, string>();
  for (const cat of CATEGORIES) {
    for (const s of cat.slugs) slugToCategory.set(s, cat.name);
  }

  const videos: Video[] = [];
  const skipped: string[] = [];

  for (const item of mediaRaw.items) {
    if (item.isArchived) continue;
    const { name, slug, video, thumbnail } = item.fieldData;
    if (!video?.url) {
      skipped.push(`${slug}: no video url`);
      continue;
    }
    const parsed = parseProvider(video.url);
    if (!parsed) {
      skipped.push(`${slug}: unparseable url ${video.url}`);
      continue;
    }

    let thumb: string | null = null;
    if (thumbnail && typeof thumbnail === "object" && thumbnail.fileId) {
      thumb = fileIdToS3.get(thumbnail.fileId) ?? null;
    }
    if (!thumb && video.metadata?.thumbnail_url) {
      thumb = video.metadata.thumbnail_url;
    }
    if (!thumb && parsed.provider === "youtube") {
      thumb = `https://i.ytimg.com/vi/${parsed.videoId}/hqdefault.jpg`;
    }
    if (!thumb) {
      skipped.push(`${slug}: no thumbnail`);
      continue;
    }

    videos.push({
      slug,
      name,
      provider: parsed.provider,
      videoId: parsed.videoId,
      embedUrl: embedFor(parsed.provider, parsed.videoId),
      externalUrl: video.url,
      thumbnail: thumb,
      category: slugToCategory.get(slug) ?? FALLBACK_CATEGORY,
    });
  }

  // Group + sort: keep CATEGORIES order; "More Stories" last.
  const ordered: Video[] = [];
  for (const cat of CATEGORIES) {
    const inCat = cat.slugs
      .map((s) => videos.find((v) => v.slug === s))
      .filter((v): v is Video => Boolean(v));
    ordered.push(...inCat);
  }
  const more = videos.filter((v) => v.category === FALLBACK_CATEGORY);
  ordered.push(...more);

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(ordered, null, 2));

  console.log(`Wrote ${OUT_FILE}`);
  console.log(`Total videos: ${ordered.length}`);
  const byCat = new Map<string, number>();
  for (const v of ordered) byCat.set(v.category, (byCat.get(v.category) ?? 0) + 1);
  for (const [cat, n] of byCat) console.log(`  ${cat}: ${n}`);
  if (skipped.length) {
    console.log("\nSkipped:");
    for (const s of skipped) console.log(`  - ${s}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
