import data from "./data/videos.json";

export type Video = {
  slug: string;
  name: string;
  provider: "youtube" | "vimeo";
  videoId: string;
  embedUrl: string;
  externalUrl: string;
  thumbnail: string;
  category: string;
};

export type VideoCategory = {
  name: string;
  videos: Video[];
};

const all = data as Video[];

export function getAllVideos(): Video[] {
  return all;
}

export function getVideosByCategory(): VideoCategory[] {
  const order: string[] = [];
  const groups = new Map<string, Video[]>();
  for (const v of all) {
    if (!groups.has(v.category)) {
      groups.set(v.category, []);
      order.push(v.category);
    }
    groups.get(v.category)!.push(v);
  }
  return order.map((name) => ({ name, videos: groups.get(name)! }));
}

const FEATURED_SLUG = "happy-dance-in-kawangware-slum-kenya";

export function getFeaturedVideo(): Video {
  return all.find((v) => v.slug === FEATURED_SLUG) ?? all[0];
}
