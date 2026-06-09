import { getItem, putItem, deleteItem } from "@/lib/dynamo";
import {
  parseExternalVideoUrl,
  youtubeAutoThumbnail,
} from "@/lib/video-url";
import { deriveCategorySlug, type VideoSection } from "@/lib/videos";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const item = await getItem("VIDEO", slug);
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(item);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = (await request.json()) as Record<string, unknown>;

  const existing = await getItem("VIDEO", slug);
  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const merged: Record<string, unknown> = { ...existing, ...data };

  // Keep the 3-section model and the legacy categorySlug in sync.
  if (typeof data.section === "string") {
    const section = data.section as VideoSection;
    const countrySlug =
      section === "stories" ? (data.countrySlug as string) || "" : "";
    merged.section = section;
    merged.countrySlug = countrySlug;
    merged.categorySlug = deriveCategorySlug(section, countrySlug);
  }

  // Re-derive embed fields if externalUrl or kind changed.
  if (merged.kind === "embed" && typeof merged.externalUrl === "string" && merged.externalUrl) {
    const parsed = parseExternalVideoUrl(merged.externalUrl);
    if (parsed) {
      merged.provider = parsed.provider;
      merged.videoId = parsed.videoId;
      merged.embedUrl = parsed.embedUrl;
      if (!merged.thumbnail && parsed.provider === "youtube") {
        merged.thumbnail = youtubeAutoThumbnail(parsed.videoId);
      }
    }
  } else if (merged.kind === "file") {
    merged.provider = "file";
    delete merged.embedUrl;
    delete merged.videoId;
    delete merged.externalUrl;
  }

  if (merged.kind === "embed" && !merged.embedUrl) {
    return Response.json(
      { error: "URL must be a YouTube or Vimeo link" },
      { status: 400 }
    );
  }
  if (merged.kind === "file" && !merged.fileUrl) {
    return Response.json({ error: "Video file is required" }, { status: 400 });
  }
  if (!merged.thumbnail) {
    return Response.json({ error: "Thumbnail is required" }, { status: 400 });
  }
  if (!merged.name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }
  if (!merged.categorySlug) {
    return Response.json({ error: "Category is required" }, { status: 400 });
  }

  merged.PK = "VIDEO";
  merged.SK = slug;
  merged.slug = slug;
  merged.updatedAt = new Date().toISOString();

  await putItem(merged);
  return Response.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await deleteItem("VIDEO", slug);
  return Response.json({ success: true });
}
