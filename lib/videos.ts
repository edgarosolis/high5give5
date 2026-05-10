import { queryByPK } from "./dynamo";

export type VideoKind = "embed" | "file";
export type VideoProvider = "youtube" | "vimeo" | "file" | "other";

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
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

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
    categorySlug: String(item.categorySlug ?? "more-stories"),
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
