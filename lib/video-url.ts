export type ParsedExternal = {
  provider: "youtube" | "vimeo";
  videoId: string;
  embedUrl: string;
};

export function parseExternalVideoUrl(url: string): ParsedExternal | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v");
      if (id) return embed("youtube", id);
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (id) return embed("youtube", id);
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (/^\d+$/.test(id)) return embed("vimeo", id);
    }
  } catch {
    return null;
  }
  return null;
}

function embed(provider: "youtube" | "vimeo", id: string): ParsedExternal {
  return {
    provider,
    videoId: id,
    embedUrl:
      provider === "youtube"
        ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
        : `https://player.vimeo.com/video/${id}?autoplay=1`,
  };
}

export function youtubeAutoThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
