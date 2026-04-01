import { getItem, putItem, deleteItem } from "@/lib/dynamo";
import { getCountryBySlug } from "@/lib/countries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const item = await getItem("COUNTRY", slug);
    if (item) return Response.json(item);
  } catch (error) {
    console.error("Failed to fetch country:", error);
  }

  // Fallback to hardcoded
  const country = getCountryBySlug(slug);
  if (country) return Response.json(country);

  return Response.json({ error: "Country not found" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = await request.json();

  try {
    await putItem({
      PK: "COUNTRY",
      SK: slug,
      ...data,
      slug,
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to update country:", error);
    return Response.json(
      { error: "Failed to save country" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await deleteItem("COUNTRY", slug);
  return Response.json({ success: true });
}
