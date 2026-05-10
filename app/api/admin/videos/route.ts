import { getItem, putItem, queryByPK } from "@/lib/dynamo";
import {
  parseExternalVideoUrl,
  slugify,
  youtubeAutoThumbnail,
} from "@/lib/video-url";

export async function GET() {
  try {
    const items = await queryByPK("VIDEO");
    items.sort(
      (a, b) =>
        Number(a.order ?? 0) - Number(b.order ?? 0) ||
        String(a.name ?? "").localeCompare(String(b.name ?? ""))
    );
    return Response.json(items);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  const data = (await request.json()) as {
    slug?: string;
    name?: string;
    kind?: "embed" | "file";
    externalUrl?: string;
    fileUrl?: string;
    thumbnail?: string;
    description?: string;
    categorySlug?: string;
    order?: number;
  };

  if (!data.name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }
  if (!data.categorySlug) {
    return Response.json({ error: "categorySlug is required" }, { status: 400 });
  }
  if (!data.kind) {
    return Response.json({ error: "kind is required" }, { status: 400 });
  }

  const slug = data.slug || slugify(data.name);
  if (!slug) {
    return Response.json({ error: "could not derive slug" }, { status: 400 });
  }

  // Reject if slug already in use.
  const existing = await getItem("VIDEO", slug);
  if (existing) {
    return Response.json(
      { error: `Slug "${slug}" already exists` },
      { status: 409 }
    );
  }

  const enriched = enrich({
    slug,
    name: data.name,
    kind: data.kind,
    externalUrl: data.externalUrl,
    fileUrl: data.fileUrl,
    thumbnail: data.thumbnail,
    description: data.description,
    categorySlug: data.categorySlug,
    order: data.order,
  });
  const validation = validateVideo(enriched);
  if (validation) return Response.json({ error: validation }, { status: 400 });

  const now = new Date().toISOString();
  await putItem({
    PK: "VIDEO",
    SK: slug,
    ...enriched,
    createdAt: now,
    updatedAt: now,
  });
  return Response.json({ slug }, { status: 201 });
}

function enrich(input: {
  slug: string;
  name: string;
  kind: "embed" | "file";
  externalUrl?: string;
  fileUrl?: string;
  thumbnail?: string;
  description?: string;
  categorySlug: string;
  order?: number;
}) {
  const out: Record<string, unknown> = {
    slug: input.slug,
    name: input.name,
    kind: input.kind,
    categorySlug: input.categorySlug,
    description: input.description,
    order: input.order ?? 0,
    thumbnail: input.thumbnail || "",
  };

  if (input.kind === "embed") {
    const parsed = input.externalUrl ? parseExternalVideoUrl(input.externalUrl) : null;
    if (!parsed) {
      out.provider = "other";
      out.externalUrl = input.externalUrl;
    } else {
      out.provider = parsed.provider;
      out.videoId = parsed.videoId;
      out.embedUrl = parsed.embedUrl;
      out.externalUrl = input.externalUrl;
      if (!out.thumbnail && parsed.provider === "youtube") {
        out.thumbnail = youtubeAutoThumbnail(parsed.videoId);
      }
    }
  } else {
    out.provider = "file";
    out.fileUrl = input.fileUrl;
  }

  return out;
}

function validateVideo(v: Record<string, unknown>): string | null {
  if (v.kind === "embed" && !v.embedUrl && !v.externalUrl) {
    return "External URL is required for embed videos";
  }
  if (v.kind === "embed" && v.provider === "other") {
    return "URL must be a YouTube or Vimeo link";
  }
  if (v.kind === "file" && !v.fileUrl) {
    return "Video file is required";
  }
  if (!v.thumbnail) {
    return "Thumbnail is required";
  }
  return null;
}

export const _testing = { enrich, validateVideo };
