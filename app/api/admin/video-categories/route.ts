import { getItem, putItem, queryByPK } from "@/lib/dynamo";
import { slugify } from "@/lib/video-url";

export async function GET() {
  try {
    const items = await queryByPK("VIDEO_CATEGORY");
    items.sort(
      (a, b) =>
        Number(a.order ?? 0) - Number(b.order ?? 0) ||
        String(a.name ?? "").localeCompare(String(b.name ?? ""))
    );
    return Response.json(items);
  } catch (error) {
    console.error("Failed to fetch video categories:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name, order } = (await request.json()) as {
    name?: string;
    order?: number;
  };

  if (!name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }
  const slug = slugify(name);
  if (!slug) {
    return Response.json({ error: "could not derive slug" }, { status: 400 });
  }

  const existing = await getItem("VIDEO_CATEGORY", slug);
  if (existing) {
    return Response.json(
      { error: `Category "${name}" already exists` },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();
  let resolvedOrder = order;
  if (resolvedOrder == null) {
    const all = await queryByPK("VIDEO_CATEGORY");
    resolvedOrder = all.length;
  }

  await putItem({
    PK: "VIDEO_CATEGORY",
    SK: slug,
    name,
    order: resolvedOrder,
    createdAt: now,
    updatedAt: now,
  });

  return Response.json({ slug }, { status: 201 });
}
