import { getItem, putItem, deleteItem, queryByPK } from "@/lib/dynamo";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { name, order } = (await request.json()) as {
    name?: string;
    order?: number;
  };

  const existing = await getItem("VIDEO_CATEGORY", slug);
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const merged = {
    ...existing,
    PK: "VIDEO_CATEGORY",
    SK: slug,
    name: name ?? existing.name,
    order: order ?? existing.order,
    updatedAt: new Date().toISOString(),
  };

  await putItem(merged);
  return Response.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Reject if any videos still belong to this category.
  const videos = await queryByPK("VIDEO");
  const inCategory = videos.filter((v) => v.categorySlug === slug);
  if (inCategory.length > 0) {
    return Response.json(
      {
        error: `Category has ${inCategory.length} video(s). Move or delete them first.`,
      },
      { status: 409 }
    );
  }

  await deleteItem("VIDEO_CATEGORY", slug);
  return Response.json({ success: true });
}
