import { queryByPK, putItem, getItem } from "@/lib/dynamo";

const SECTION_MAP: Record<string, string> = {
  "global-stats": "GLOBAL_STATS",
  "homepage-hero": "HOMEPAGE_HERO",
  "homepage-story": "HOMEPAGE_STORY",
  "homepage-video": "HOMEPAGE_VIDEO",
  "homepage-donate-cta": "HOMEPAGE_DONATE_CTA",
  "about-founding-story": "ABOUT_FOUNDING_STORY",
  "about-ministry": "ABOUT_MINISTRY",
  "contact-info": "CONTACT_INFO",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  if (section) {
    const sk = SECTION_MAP[section];
    if (!sk) {
      return Response.json({ error: "Unknown section" }, { status: 400 });
    }
    const item = await getItem("SETTINGS", sk);
    return Response.json(item || {});
  }

  // Return all settings
  const items = await queryByPK("SETTINGS");
  return Response.json(items);
}

export async function PUT(request: Request) {
  const { section, data } = await request.json();

  const sk = SECTION_MAP[section];
  if (!sk) {
    return Response.json({ error: "Unknown section" }, { status: 400 });
  }

  await putItem({
    PK: "SETTINGS",
    SK: sk,
    ...data,
  });

  return Response.json({ success: true });
}
