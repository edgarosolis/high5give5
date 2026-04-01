import { queryByPK, putItem } from "@/lib/dynamo";

export async function GET() {
  try {
    const items = await queryByPK("BLOG");
    const sorted = items.sort(
      (a, b) =>
        new Date(b.publishedAt as string).getTime() -
        new Date(a.publishedAt as string).getTime()
    );
    return Response.json(sorted);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  if (!data.title || !data.slug || !data.countrySlug || !data.body) {
    return Response.json(
      { error: "title, slug, countrySlug, and body are required" },
      { status: 400 }
    );
  }

  try {
    await putItem({
      PK: "BLOG",
      SK: data.slug,
      ...data,
      publishedAt: data.publishedAt || new Date().toISOString(),
    });
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return Response.json({ error: "Failed to save blog post" }, { status: 500 });
  }
}
