import { queryByPK, putItem } from "@/lib/dynamo";
import { countries as hardcodedCountries } from "@/lib/countries";

export async function GET() {
  try {
    const items = await queryByPK("COUNTRY");
    if (items.length > 0) {
      const sorted = items.sort((a, b) =>
        (a.name as string).localeCompare(b.name as string)
      );
      return Response.json(sorted);
    }
  } catch (error) {
    console.error("Failed to fetch countries:", error);
  }
  // Fallback to hardcoded
  return Response.json(hardcodedCountries);
}

export async function POST(request: Request) {
  const data = await request.json();

  if (!data.name || !data.slug || !data.projectType || !data.region) {
    return Response.json(
      { error: "name, slug, projectType, and region are required" },
      { status: 400 }
    );
  }

  await putItem({
    PK: "COUNTRY",
    SK: data.slug,
    ...data,
  });

  return Response.json({ success: true }, { status: 201 });
}
