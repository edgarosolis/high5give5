import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID ?? "62b34d428b67bb250e35007e";
const OUT_DIR = join(process.cwd(), "public", "legacy", "webflow-cms");
const API = "https://api.webflow.com/v2";

if (!TOKEN) {
  console.error("Missing WEBFLOW_TOKEN env var");
  process.exit(1);
}

type Collection = {
  id: string;
  displayName: string;
  singularName: string;
  slug: string;
  createdOn: string;
  lastUpdated: string;
};

type CollectionSchema = Collection & {
  fields: Array<{ id: string; isRequired: boolean; type: string; slug: string; displayName: string; helpText?: string; validations?: unknown }>;
};

type Item = {
  id: string;
  cmsLocaleId?: string;
  lastPublished?: string | null;
  lastUpdated: string;
  createdOn: string;
  isArchived?: boolean;
  isDraft?: boolean;
  fieldData: Record<string, unknown>;
};

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "accept-version": "2.0.0",
    },
  });
  if (!res.ok) {
    throw new Error(`${path} -> ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

async function listCollections(): Promise<Collection[]> {
  const data = await api<{ collections: Collection[] }>(`/sites/${SITE_ID}/collections`);
  return data.collections;
}

async function getSchema(collectionId: string): Promise<CollectionSchema> {
  return api<CollectionSchema>(`/collections/${collectionId}`);
}

async function listAllItems(collectionId: string): Promise<Item[]> {
  const all: Item[] = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const data = await api<{ items: Item[]; pagination?: { total: number } }>(
      `/collections/${collectionId}/items?limit=${limit}&offset=${offset}`
    );
    all.push(...data.items);
    if (data.items.length < limit) break;
    offset += limit;
  }
  return all;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Listing collections for site ${SITE_ID}…`);
  const collections = await listCollections();
  console.log(`Found ${collections.length} collections`);

  const summary: Array<{ slug: string; displayName: string; itemCount: number; file: string }> = [];

  for (const c of collections) {
    process.stdout.write(`  ${c.slug}…`);
    const [schema, items] = await Promise.all([getSchema(c.id), listAllItems(c.id)]);
    const file = `${c.slug}.json`;
    await writeFile(
      join(OUT_DIR, file),
      JSON.stringify({ collection: schema, itemCount: items.length, items }, null, 2)
    );
    summary.push({ slug: c.slug, displayName: c.displayName, itemCount: items.length, file });
    process.stdout.write(` ${items.length} items\n`);
  }

  await writeFile(
    join(OUT_DIR, "_index.json"),
    JSON.stringify(
      {
        siteId: SITE_ID,
        downloadedAt: new Date().toISOString(),
        collections: summary,
      },
      null,
      2
    )
  );

  console.log(`\nDone. Saved to ${OUT_DIR}`);
  console.log(`Total items across collections: ${summary.reduce((n, c) => n + c.itemCount, 0)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
