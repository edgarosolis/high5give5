/**
 * One-time seed: push lib/data/videos.json + categories into DynamoDB.
 * Re-runnable — uses Put which overwrites existing items by PK/SK.
 *
 * Run with: AWS_PROFILE=shannon npx tsx scripts/seed-videos.ts
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const ROOT = join(__dirname, "..");
const VIDEOS_JSON = join(ROOT, "lib/data/videos.json");

const TABLE = process.env.DYNAMODB_TABLE_NAME || "High5Give5Content";
const client = new DynamoDBClient({
  region: process.env.APP_AWS_REGION || process.env.AWS_REGION || "us-east-1",
});
const doc = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

type SeedVideo = {
  slug: string;
  name: string;
  provider: "youtube" | "vimeo";
  videoId: string;
  embedUrl: string;
  externalUrl: string;
  thumbnail: string;
  category: string;
};

const CATEGORY_ORDER = [
  "Children's Voices",
  "Kenya",
  "Armenia",
  "Philippines",
  "Founders & Tributes",
  "More Stories",
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function batchPut(items: Record<string, unknown>[]) {
  for (let i = 0; i < items.length; i += 25) {
    const chunk = items.slice(i, i + 25);
    await doc.send(
      new BatchWriteCommand({
        RequestItems: {
          [TABLE]: chunk.map((item) => ({ PutRequest: { Item: item } })),
        },
      })
    );
  }
}

async function main() {
  const data = JSON.parse(await readFile(VIDEOS_JSON, "utf8")) as SeedVideo[];
  const now = new Date().toISOString();

  // Build category items.
  const categorySlugByName = new Map<string, string>();
  const categoryItems = CATEGORY_ORDER.map((name, order) => {
    const slug = slugify(name);
    categorySlugByName.set(name, slug);
    return {
      PK: "VIDEO_CATEGORY",
      SK: slug,
      name,
      order,
      createdAt: now,
      updatedAt: now,
    };
  });

  // Build video items, preserving order within category.
  const orderInCat = new Map<string, number>();
  const videoItems = data.map((v) => {
    const categorySlug =
      categorySlugByName.get(v.category) ?? slugify(v.category);
    const order = orderInCat.get(categorySlug) ?? 0;
    orderInCat.set(categorySlug, order + 1);
    return {
      PK: "VIDEO",
      SK: v.slug,
      name: v.name,
      kind: "embed",
      provider: v.provider,
      videoId: v.videoId,
      embedUrl: v.embedUrl,
      externalUrl: v.externalUrl,
      thumbnail: v.thumbnail,
      categorySlug,
      order,
      createdAt: now,
      updatedAt: now,
    };
  });

  console.log(`Seeding ${categoryItems.length} categories…`);
  await batchPut(categoryItems);
  console.log(`Seeding ${videoItems.length} videos…`);
  await batchPut(videoItems);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
