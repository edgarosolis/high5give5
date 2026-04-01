import { getItem, putItem, deleteItem } from "@/lib/dynamo";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const item = await getItem("BLOG", slug);
    if (item) return Response.json(item);
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
  }

  return Response.json({ error: "Blog post not found" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = await request.json();

  try {
    await putItem({
      PK: "BLOG",
      SK: slug,
      ...data,
      slug,
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return Response.json({ error: "Failed to save blog post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await deleteItem("BLOG", slug);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return Response.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
