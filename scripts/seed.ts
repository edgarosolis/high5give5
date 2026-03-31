/**
 * Seed script — populates DynamoDB with current hardcoded content.
 * Run: npx tsx scripts/seed.ts
 *
 * Requires AWS credentials and env vars:
 *   AWS_REGION, DYNAMODB_TABLE_NAME
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.APP_AWS_REGION || process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});
const TABLE = process.env.DYNAMODB_TABLE_NAME || "High5Give5Content";

// ─── Country Data ─────────────

const countries = [
  { name: "Afghanistan", slug: "afghanistan", projectType: "Feeding", description: "Providing meals to families affected by conflict and displacement, reaching communities in desperate need of food security.", mealsPerFive: 50, childrenFed: 200, region: "asia", imageUrl: "/images/afghanistan.jpg", lat: 33.93, lng: 67.71 },
  { name: "Albania", slug: "albania", projectType: "Feeding Butterfly Project #3", description: "In partnership with Ancora International, we are bringing hope to children, families, and the elderly across Albania and the surrounding region.", mealsPerFive: 50, childrenFed: 150, region: "europe", imageUrl: "/images/albania.jpg", lat: 41.15, lng: 20.17, partner: "Ancora International", intro: "In partnership with Ancora International, we are bringing hope to children, families, and the elderly across Albania and the surrounding region. Through this outreach, your support helps provide food packages for families in deep poverty, care for widows, orphans, and abandoned elderly, emotional and spiritual encouragement, and ongoing visits to those who feel forgotten.", sections: [{ title: "The Need", content: "Albania is facing a growing economic crisis.", bullets: ["Food prices have risen dramatically", "Transportation and daily costs continue to increase", "Many families are struggling just to get by", "The poorest are being hit the hardest—especially children and the elderly"] }, { title: "What You Make Possible", content: "Because of your giving:", bullets: ["Families receive essential food support", "Children are nourished and cared for", "The elderly are visited and no longer feel alone", "Hope is restored in difficult circumstances"] }, { title: "More Than Food", content: "Beyond meeting immediate needs, we believe in long-term transformation. Through regular visits, prayer, and encouragement:", bullets: ["Lives are strengthened", "Faith is restored", "Communities are uplifted"] }, { title: "A Simple Gift. A Real Impact.", content: "Even a small gift can go a long way. What may seem little can make a life-changing difference for someone in need. Help us continue reaching families in Albania." }] },
  { name: "Armenia", slug: "armenia", projectType: "Food Bags to the Elderly", description: "Delivering food bags to elderly community members who are often isolated and unable to access regular meals.", mealsPerFive: 50, childrenFed: 100, region: "europe", imageUrl: "/images/armenia.jpg", lat: 40.07, lng: 45.04 },
  { name: "Belarus", slug: "belarus", projectType: "Food Packages", description: "Distributing essential food packages to vulnerable families and children in need across Belarus.", mealsPerFive: 50, childrenFed: 120, region: "europe", imageUrl: "/images/albania.jpg", lat: 53.71, lng: 27.95 },
  { name: "Colombia", slug: "colombia", projectType: "Food Distribution", description: "In partnership with Ciudad Refugio, we are bringing food, care, and hope to vulnerable families in Colombia.", mealsPerFive: 50, childrenFed: 300, region: "americas", imageUrl: "/images/colombia.jpg", lat: 4.57, lng: -74.30, partner: "Ciudad Refugio", intro: "In partnership with Ciudad Refugio, we are bringing food, care, and hope to vulnerable families in Colombia—many of whom have been displaced by conflict or forced to flee neighboring Venezuela.", sections: [{ title: "The Need", content: "Colombia continues to face a deep humanitarian challenge.", bullets: ["Over 7 million people have been internally displaced", "Thousands of Venezuelan families cross into Colombia seeking safety", "Many are forced to live in overcrowded or unsafe housing", "Families are left with impossible choices just to meet basic needs"] }, { title: "What You Make Possible", content: "Because of your generosity:", bullets: ["50 families receive monthly food packages", "Children and single mothers are provided with hot meals each week", "Vulnerable families receive ongoing care and support"] }, { title: "More Than Food", content: "Your support goes beyond meeting physical needs:", bullets: ["Children receive care, activities, and encouragement", "Single mothers are supported emotionally and spiritually", "Communities are strengthened through ongoing presence and love"] }, { title: "A Simple Gift. A Powerful Impact.", content: "Your gift can help provide meals, support a family, and bring hope to someone in desperate need." }] },
  { name: "Croatia", slug: "croatia", projectType: "Feeding", description: "Providing meals and support to families in need across Croatia, focusing on children and the elderly.", mealsPerFive: 50, childrenFed: 80, region: "europe", imageUrl: "/images/croatia.jpg", lat: 45.10, lng: 15.20 },
  { name: "El Salvador", slug: "el-salvador", projectType: "School Supplies", description: "Equipping children with school supplies and meals so they can focus on learning and building a brighter future.", mealsPerFive: 50, childrenFed: 250, region: "americas", imageUrl: "/images/el-salvador.jpeg", lat: 13.79, lng: -88.90 },
  { name: "Greece", slug: "greece", projectType: "Feeding the Homeless", description: "Serving meals to homeless individuals and refugees, providing warmth and hope through nourishing food.", mealsPerFive: 50, childrenFed: 180, region: "europe", imageUrl: "/images/greece.jpg", lat: 39.07, lng: 21.82 },
  { name: "India", slug: "india", projectType: "Feeding", description: "Reaching children in India with nutritious meals, supporting communities where hunger remains a daily challenge.", mealsPerFive: 50, childrenFed: 500, region: "asia", imageUrl: "/images/india.jpg", lat: 20.59, lng: 78.96 },
  { name: "Iraq", slug: "iraq", projectType: "Food Bags for Refugees", description: "Providing essential food bags to refugee families displaced by conflict.", mealsPerFive: 50, childrenFed: 200, region: "middle-east", imageUrl: "/images/iraq.jpg", lat: 33.22, lng: 43.68 },
  { name: "Italy", slug: "italy", projectType: "Feeding", description: "Supporting feeding programs for migrants and vulnerable communities in Italy.", mealsPerFive: 50, childrenFed: 100, region: "europe", imageUrl: "/images/italy.jpg", lat: 41.87, lng: 12.57 },
  { name: "Jordan", slug: "jordan", projectType: "Baby Formula", description: "Supplying baby formula to refugee families, ensuring the youngest receive proper nutrition.", mealsPerFive: 50, childrenFed: 150, region: "middle-east", imageUrl: "/images/iraq.jpg", lat: 30.59, lng: 36.24 },
  { name: "Kenya", slug: "kenya", projectType: "Water & Well", description: "Building wells and providing clean water access alongside feeding programs.", mealsPerFive: 50, childrenFed: 400, region: "africa", imageUrl: "/images/kenya.jpg", lat: -0.02, lng: 37.91 },
  { name: "Lebanon", slug: "lebanon", projectType: "Feeding", description: "Feeding families affected by economic crisis and displacement in Lebanon.", mealsPerFive: 50, childrenFed: 250, region: "middle-east", imageUrl: "/images/lebanon.jpg", lat: 33.85, lng: 35.86 },
  { name: "Moldova", slug: "moldova", projectType: "Bread for the Poor", description: "Through our partnership with Pastor Viktor Kulyak of Emmanuel Church, we provide daily bread to families in deep poverty.", mealsPerFive: 50, childrenFed: 120, region: "europe", imageUrl: "/images/moldova.jpg", lat: 47.41, lng: 28.37, partner: "Pastor Viktor Kulyak, Emmanuel Church", intro: "Through our partnership with Pastor Viktor Kulyak of Emmanuel Church, we provide daily bread to families living in deep poverty in rural Moldova.", sections: [{ title: "The Need", content: "Many families in rural Moldova struggle with extreme poverty, limited access to food, and little support—especially the elderly and children." }, { title: "What You Make Possible", content: "Because of your generosity:", bullets: ["Families receive daily bread", "Children are nourished and supported after school", "The elderly are cared for and not forgotten", "Local communities are strengthened through consistent outreach"] }, { title: "A Simple Gift. A Real Impact.", content: "Your gift brings both practical help and lasting hope. Help us continue providing daily bread to families in rural Moldova." }] },
  { name: "Nicaragua", slug: "nicaragua", projectType: "Feeding", description: "Providing meals and nutritional support to children and families in Nicaragua.", mealsPerFive: 50, childrenFed: 180, region: "americas", imageUrl: "/images/colombia.jpg", lat: 12.87, lng: -85.21 },
  { name: "Paraguay", slug: "paraguay", projectType: "Feeding", description: "Supporting feeding programs that reach underserved communities in Paraguay.", mealsPerFive: 50, childrenFed: 200, region: "americas", imageUrl: "/images/paraguay.jpg", lat: -23.44, lng: -58.44 },
  { name: "Philippines", slug: "philippines", projectType: "Meals for Children in the Slums", description: "Serving nutritious meals to children living in slum communities.", mealsPerFive: 50, childrenFed: 350, region: "asia", imageUrl: "/images/philippines.jpg", lat: 12.88, lng: 121.77 },
  { name: "Serbia", slug: "serbia", projectType: "Feeding", description: "Providing meals to vulnerable families and refugees in Serbia.", mealsPerFive: 50, childrenFed: 100, region: "europe", imageUrl: "/images/serbia.jpg", lat: 44.02, lng: 21.01 },
  { name: "Spain", slug: "spain", projectType: "Feeding", description: "Supporting feeding initiatives for immigrant communities and families in need across Spain.", mealsPerFive: 50, childrenFed: 150, region: "europe", imageUrl: "/images/spain.jpg", lat: 40.46, lng: -3.75 },
  { name: "Syria", slug: "syria", projectType: "Feeding", description: "Reaching families in Syria with critical food support during ongoing conflict.", mealsPerFive: 50, childrenFed: 300, region: "middle-east", imageUrl: "/images/iraq.jpg", lat: 34.80, lng: 38.99 },
  { name: "Turkey", slug: "turkey", projectType: "Syrian Refugees Outreach", description: "Serving Syrian refugee families in Turkey with meals, supplies, and community support.", mealsPerFive: 50, childrenFed: 400, region: "middle-east", imageUrl: "/images/turkey.jpg", lat: 38.96, lng: 35.24 },
  { name: "Uganda", slug: "uganda", projectType: "Feeding & Special Projects", description: "Combining feeding programs with special community projects to create lasting change.", mealsPerFive: 50, childrenFed: 350, region: "africa", imageUrl: "/images/uganda.jpg", lat: 1.37, lng: 32.29 },
  { name: "Ukraine", slug: "ukraine", projectType: "Feeding", description: "Providing emergency food relief to families affected by conflict in Ukraine.", mealsPerFive: 50, childrenFed: 500, region: "europe", imageUrl: "/images/ukraine.jpg", lat: 48.38, lng: 31.17 },
  { name: "Venezuela", slug: "venezuela", projectType: "Feeding", description: "Feeding children and families amid the ongoing humanitarian crisis in Venezuela.", mealsPerFive: 50, childrenFed: 400, region: "americas", imageUrl: "/images/venezuela.jpg", lat: 6.42, lng: -66.59 },
];

// ─── Settings Data ─────────────

const settings = [
  {
    PK: "SETTINGS", SK: "GLOBAL_STATS",
    countriesServed: 22, childrenFed: 6000, elderlyServed: 2000, mealsPerFive: 50,
  },
  {
    PK: "SETTINGS", SK: "HOMEPAGE_HERO",
    heading: "Give $5 to a Higher Cause",
    tagline: "From those who have to those who need — join us feed the hungry and bring hope",
    backgroundImage: "/images/hero.jpg",
    ctaPrimaryText: "See Our Impact", ctaPrimaryLink: "#impact",
    ctaSecondaryText: "Donate Now", ctaSecondaryLink: "/donate",
  },
  {
    PK: "SETTINGS", SK: "HOMEPAGE_STORY",
    sectionLabel: "Our Story",
    heading: "It Started With Two 7-Year-Olds and $5",
    bodyText: 'It all began when Sam, just 7 years old, sold his toys to raise money to feed the poor. Around the same time, a little girl named Genevieve, also 7, sent a handwritten card along with $5, with a simple message: "Take a chance with 5." Their compassion sparked a movement — proving that even the smallest gift can make the biggest difference. Today, High 5 Give 5 carries that spirit forward, turning every $5 into 50 meals for those in need around the world.',
    linkText: "Read Our Story", linkUrl: "/about",
  },
  { PK: "SETTINGS", SK: "HOMEPAGE_STEP#1", iconName: "heart", title: "Give $5", description: "Make a simple $5 donation. That's all it takes to start changing lives around the world.", order: 1 },
  { PK: "SETTINGS", SK: "HOMEPAGE_STEP#2", iconName: "globe", title: "We Distribute Locally", description: "Our partners on the ground deliver food directly to communities in 22+ countries.", order: 2 },
  { PK: "SETTINGS", SK: "HOMEPAGE_STEP#3", iconName: "smile", title: "Lives Are Changed", description: "Children are fed, families gain hope, and communities grow stronger — one meal at a time.", order: 3 },
  {
    PK: "SETTINGS", SK: "HOMEPAGE_VIDEO",
    sectionLabel: "Watch Our Story",
    heading: "See the Impact of Your Generosity",
    videoUrl: "/images/story-video.mp4", posterImage: "/images/hero.jpg",
  },
  {
    PK: "SETTINGS", SK: "HOMEPAGE_DONATE_CTA",
    heading: "Your $5 Can Change Everything",
    bodyText: "Every $5 donated provides 50 meals to those in need. 100% of your donation goes directly to feeding programs.",
    buttonText: "Donate Now", buttonLink: "/donate",
    footnote: "High 5 Give 5 is a 501(c)(3) nonprofit organization. All donations are tax deductible.",
  },
  {
    PK: "SETTINGS", SK: "ABOUT_FOUNDING_STORY",
    heading: "How It Began",
    paragraphs: [
      "It started with a seven-year-old boy named Sam who had a heart bigger than his toy collection. One day, Sam decided to sell his toys -- not for a new video game or a bigger bike, but to feed children who were going hungry.",
      'A week later, a girl named Genevieve, also seven years old, sent a card with $5 tucked inside. Her message was simple but powerful: "Take a chance with 5 and see how much more arrives."',
      "That $5 became a prayer and a promise. They took a chance, and what arrived was nothing short of a miracle -- a movement that would grow to feed thousands of children across the globe.",
    ],
  },
  { PK: "SETTINGS", SK: "ABOUT_TIMELINE#2019", year: "2019", title: "Founded with $5", description: "Sam sold his toys and Genevieve sent a card with $5. A prayer, a chance, and a mission was born.", order: 1 },
  { PK: "SETTINGS", SK: "ABOUT_TIMELINE#2020", year: "2020", title: "Expanded to 5 Countries", description: "From a single act of generosity, High 5 Give 5 grew to serve children in five countries.", order: 2 },
  { PK: "SETTINGS", SK: "ABOUT_TIMELINE#2022", year: "2022", title: "Reached 15 Countries", description: "Our network of partners expanded rapidly, bringing meals and hope to children in 15 nations.", order: 3 },
  { PK: "SETTINGS", SK: "ABOUT_TIMELINE#2024", year: "2024", title: "Serving 22+ Countries", description: "Now feeding over 6,000 children daily across more than 22 countries.", order: 4 },
  {
    PK: "SETTINGS", SK: "ABOUT_MINISTRY",
    heading: "Ministry Overview",
    bodyText: "High 5 Give 5 operates in over 22 countries around the world, partnering with local organizations to feed children, support the elderly, and bring hope to communities in need.",
  },
  {
    PK: "SETTINGS", SK: "CONTACT_INFO",
    email: "info@high5give5.org",
    locationText: "Serving 22+ countries worldwide",
    socialLinks: { facebook: "#", instagram: "#", youtube: "#", twitter: "#" },
  },
];

// ─── Seed ─────────────

async function seed() {
  console.log(`Seeding table: ${TABLE}`);

  const allItems = [
    ...settings,
    ...countries.map((c) => ({ PK: "COUNTRY", SK: c.slug, ...c })),
  ];

  // BatchWrite in chunks of 25
  for (let i = 0; i < allItems.length; i += 25) {
    const chunk = allItems.slice(i, i + 25);
    console.log(`  Writing items ${i + 1}–${i + chunk.length} of ${allItems.length}...`);

    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [TABLE]: chunk.map((item) => ({
            PutRequest: { Item: item },
          })),
        },
      })
    );
  }

  console.log(`Done! Seeded ${allItems.length} items.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
