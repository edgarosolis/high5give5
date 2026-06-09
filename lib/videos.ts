import { queryByPK } from "./dynamo";
import { countries } from "./countries";
import { getCountryFlagUrl } from "./country-flags";

export type VideoKind = "embed" | "file";
export type VideoProvider = "youtube" | "vimeo" | "file" | "other";

// The media library is organized into exactly three top-level sections.
export type VideoSection = "stories" | "founders" | "children";

export const VIDEO_SECTIONS: { value: VideoSection; label: string; order: number }[] = [
  { value: "stories", label: "Stories", order: 0 },
  { value: "founders", label: "Founders & Tributes", order: 1 },
  { value: "children", label: "Children's Voices", order: 2 },
];

export type Video = {
  slug: string;
  name: string;
  kind: VideoKind;
  provider: VideoProvider;
  videoId?: string;
  embedUrl?: string;
  externalUrl?: string;
  fileUrl?: string;
  thumbnail: string;
  description?: string;
  categorySlug: string;
  category?: string;
  // New 3-section model. `countrySlug` only applies when section === "stories"
  // ("" means the unassigned "More Stories" bucket).
  section: VideoSection;
  countrySlug: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

// Stories videos grouped under a single country tile (drill-down view).
export type StoriesCountry = {
  countrySlug: string; // "" for the unassigned "More Stories" bucket
  name: string;
  flagUrl: string | null;
  thumbnail: string;
  videos: Video[];
};

export type MediaSections = {
  stories: StoriesCountry[];
  founders: Video[];
  children: Video[];
};

const COUNTRY_BY_SLUG = new Map(countries.map((c) => [c.slug, c]));

// Derive the section for legacy videos that predate the `section` field.
export function inferSection(categorySlug: string): VideoSection {
  const s = (categorySlug || "").toLowerCase();
  if (s.includes("child")) return "children";
  if (s.includes("found") || s.includes("tribut")) return "founders";
  return "stories";
}

// Legacy `categorySlug` kept in sync with the 3-section model for back-compat.
export function deriveCategorySlug(
  section: VideoSection,
  countrySlug: string
): string {
  if (section === "children") return "children-s-voices";
  if (section === "founders") return "founders-and-tributes";
  return countrySlug || "more-stories"; // stories
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export type VideoCategoryEntity = {
  slug: string;
  name: string;
  order: number;
};

export type VideoCategory = {
  name: string;
  slug: string;
  videos: Video[];
};

const VIDEO_PK = "VIDEO";
const CATEGORY_PK = "VIDEO_CATEGORY";

function fromItem(item: Record<string, unknown>): Video {
  const categorySlug = String(item.categorySlug ?? "more-stories");
  const section: VideoSection =
    (item.section as VideoSection) ?? inferSection(categorySlug);
  // Resolve the country for Stories videos, falling back to the legacy
  // categorySlug when it names a real country.
  let countrySlug = "";
  if (section === "stories") {
    if (item.countrySlug != null) {
      countrySlug = String(item.countrySlug);
    } else if (categorySlug !== "more-stories" && COUNTRY_BY_SLUG.has(categorySlug)) {
      countrySlug = categorySlug;
    }
  }
  return {
    slug: String(item.SK),
    name: String(item.name ?? ""),
    kind: (item.kind as VideoKind) ?? "embed",
    provider: (item.provider as VideoProvider) ?? "other",
    videoId: item.videoId as string | undefined,
    embedUrl: item.embedUrl as string | undefined,
    externalUrl: item.externalUrl as string | undefined,
    fileUrl: item.fileUrl as string | undefined,
    thumbnail: String(item.thumbnail ?? ""),
    description: item.description as string | undefined,
    categorySlug: categorySlug,
    section: section,
    countrySlug: countrySlug,
    order: Number(item.order ?? 0),
    createdAt: item.createdAt as string | undefined,
    updatedAt: item.updatedAt as string | undefined,
  };
}

function categoryFromItem(item: Record<string, unknown>): VideoCategoryEntity {
  return {
    slug: String(item.SK),
    name: String(item.name ?? item.SK ?? ""),
    order: Number(item.order ?? 0),
  };
}

export async function getAllVideos(): Promise<Video[]> {
  try {
    const items = await queryByPK(VIDEO_PK);
    return items.map(fromItem);
  } catch (err) {
    console.error("Failed to fetch videos:", err);
    return [];
  }
}

export async function getAllCategories(): Promise<VideoCategoryEntity[]> {
  try {
    const items = await queryByPK(CATEGORY_PK);
    return items
      .map(categoryFromItem)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Failed to fetch video categories:", err);
    return [];
  }
}

export async function getVideosByCategory(): Promise<VideoCategory[]> {
  const [videos, categories] = await Promise.all([getAllVideos(), getAllCategories()]);

  const grouped = new Map<string, Video[]>();
  for (const v of videos) {
    const list = grouped.get(v.categorySlug) ?? [];
    list.push(v);
    grouped.set(v.categorySlug, list);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }

  const result: VideoCategory[] = [];
  for (const cat of categories) {
    const inCat = grouped.get(cat.slug);
    if (inCat && inCat.length > 0) {
      for (const v of inCat) v.category = cat.name;
      result.push({ name: cat.name, slug: cat.slug, videos: inCat });
      grouped.delete(cat.slug);
    }
  }
  // Any videos whose category isn't in the categories table get bucketed at the end.
  if (grouped.size > 0) {
    const orphan: Video[] = [];
    for (const list of grouped.values()) orphan.push(...list);
    if (orphan.length) {
      for (const v of orphan) v.category = "More Stories";
      result.push({ name: "More Stories", slug: "more-stories", videos: orphan });
    }
  }

  return result;
}

const byOrder = (a: Video, b: Video) =>
  a.order - b.order || a.name.localeCompare(b.name);

// Build the 3-section media structure for the public /media page.
// Stories videos are grouped by country (for the drill-down tiles).
export async function getMediaSections(): Promise<MediaSections> {
  const videos = await getAllVideos();

  const founders = videos.filter((v) => v.section === "founders").sort(byOrder);
  const children = videos.filter((v) => v.section === "children").sort(byOrder);

  const byCountry = new Map<string, Video[]>();
  for (const v of videos.filter((v) => v.section === "stories")) {
    const key = v.countrySlug || "";
    const list = byCountry.get(key) ?? [];
    list.push(v);
    byCountry.set(key, list);
  }

  const stories: StoriesCountry[] = [];
  for (const [slug, vids] of byCountry) {
    vids.sort(byOrder);
    const country = slug ? COUNTRY_BY_SLUG.get(slug) : undefined;
    stories.push({
      countrySlug: slug,
      name: slug ? country?.name ?? titleCase(slug) : "More Stories",
      flagUrl: slug ? getCountryFlagUrl(slug) : null,
      thumbnail: country?.imageUrl || vids[0]?.thumbnail || "",
      videos: vids,
    });
  }
  // Countries alphabetically; the unassigned "More Stories" bucket goes last.
  stories.sort((a, b) => {
    if (a.countrySlug === "") return 1;
    if (b.countrySlug === "") return -1;
    return a.name.localeCompare(b.name);
  });

  return { stories, founders, children };
}
