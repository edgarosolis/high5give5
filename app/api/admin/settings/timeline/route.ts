import { putItem, queryBySKPrefix, deleteItem } from "@/lib/dynamo";

export async function GET() {
  const items = await queryBySKPrefix("SETTINGS", "ABOUT_TIMELINE#");
  const sorted = items.sort((a, b) => (a.order as number) - (b.order as number));
  return Response.json(sorted);
}

export async function PUT(request: Request) {
  const { entries } = await request.json();

  // Delete existing entries
  const existing = await queryBySKPrefix("SETTINGS", "ABOUT_TIMELINE#");
  for (const item of existing) {
    await deleteItem("SETTINGS", item.SK as string);
  }

  // Write new entries
  for (let i = 0; i < entries.length; i++) {
    await putItem({
      PK: "SETTINGS",
      SK: `ABOUT_TIMELINE#${entries[i].year}`,
      ...entries[i],
      order: i + 1,
    });
  }

  return Response.json({ success: true });
}
