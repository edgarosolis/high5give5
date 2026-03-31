import { putItem, queryBySKPrefix, deleteItem } from "@/lib/dynamo";

export async function GET() {
  const items = await queryBySKPrefix("SETTINGS", "HOMEPAGE_STEP#");
  const sorted = items.sort((a, b) => (a.order as number) - (b.order as number));
  return Response.json(sorted);
}

export async function PUT(request: Request) {
  const { steps } = await request.json();

  // Delete existing steps
  const existing = await queryBySKPrefix("SETTINGS", "HOMEPAGE_STEP#");
  for (const item of existing) {
    await deleteItem("SETTINGS", item.SK as string);
  }

  // Write new steps
  for (let i = 0; i < steps.length; i++) {
    await putItem({
      PK: "SETTINGS",
      SK: `HOMEPAGE_STEP#${i + 1}`,
      ...steps[i],
      order: i + 1,
    });
  }

  return Response.json({ success: true });
}
