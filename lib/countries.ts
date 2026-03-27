export interface Country {
  name: string;
  slug: string;
  projectType: string;
  description: string;
  mealsPerFive: number;
  childrenFed: number;
  region: "europe" | "asia" | "africa" | "americas" | "middle-east";
  imageUrl: string;
  lat: number;
  lng: number;
}

export const countries: Country[] = [
  { name: "Afghanistan", slug: "afghanistan", projectType: "Feeding", description: "Providing meals to families affected by conflict and displacement, reaching communities in desperate need of food security.", mealsPerFive: 50, childrenFed: 200, region: "asia", imageUrl: "/images/afghanistan.jpg", lat: 33.93, lng: 67.71 },
  { name: "Albania", slug: "albania", projectType: "Butterfly Project", description: "The Butterfly Project transforms lives through feeding programs and community development, helping families break the cycle of poverty.", mealsPerFive: 50, childrenFed: 150, region: "europe", imageUrl: "/images/albania.jpg", lat: 41.15, lng: 20.17 },
  { name: "Armenia", slug: "armenia", projectType: "Food Bags to the Elderly", description: "Delivering food bags to elderly community members who are often isolated and unable to access regular meals.", mealsPerFive: 50, childrenFed: 100, region: "europe", imageUrl: "/images/armenia.jpg", lat: 40.07, lng: 45.04 },
  { name: "Belarus", slug: "belarus", projectType: "Food Packages", description: "Distributing essential food packages to vulnerable families and children in need across Belarus.", mealsPerFive: 50, childrenFed: 120, region: "europe", imageUrl: "/images/albania.jpg", lat: 53.71, lng: 27.95 },
  { name: "Colombia", slug: "colombia", projectType: "Food Distribution", description: "Supporting food distribution networks that reach families in underserved communities throughout Colombia.", mealsPerFive: 50, childrenFed: 300, region: "americas", imageUrl: "/images/colombia.jpg", lat: 4.57, lng: -74.30 },
  { name: "Croatia", slug: "croatia", projectType: "Feeding", description: "Providing meals and support to families in need across Croatia, focusing on children and the elderly.", mealsPerFive: 50, childrenFed: 80, region: "europe", imageUrl: "/images/croatia.jpg", lat: 45.10, lng: 15.20 },
  { name: "El Salvador", slug: "el-salvador", projectType: "School Supplies", description: "Equipping children with school supplies and meals so they can focus on learning and building a brighter future.", mealsPerFive: 50, childrenFed: 250, region: "americas", imageUrl: "/images/el-salvador.jpeg", lat: 13.79, lng: -88.90 },
  { name: "Greece", slug: "greece", projectType: "Feeding the Homeless", description: "Serving meals to homeless individuals and refugees, providing warmth and hope through nourishing food.", mealsPerFive: 50, childrenFed: 180, region: "europe", imageUrl: "/images/greece.jpg", lat: 39.07, lng: 21.82 },
  { name: "India", slug: "india", projectType: "Feeding", description: "Reaching children in India with nutritious meals, supporting communities where hunger remains a daily challenge.", mealsPerFive: 50, childrenFed: 500, region: "asia", imageUrl: "/images/india.jpg", lat: 20.59, lng: 78.96 },
  { name: "Iraq", slug: "iraq", projectType: "Food Bags for Refugees", description: "Providing essential food bags to refugee families displaced by conflict, offering sustenance and dignity.", mealsPerFive: 50, childrenFed: 200, region: "middle-east", imageUrl: "/images/iraq.jpg", lat: 33.22, lng: 43.68 },
  { name: "Italy", slug: "italy", projectType: "Feeding", description: "Supporting feeding programs for migrants and vulnerable communities in Italy.", mealsPerFive: 50, childrenFed: 100, region: "europe", imageUrl: "/images/italy.jpg", lat: 41.87, lng: 12.57 },
  { name: "Jordan", slug: "jordan", projectType: "Baby Formula", description: "Supplying baby formula to refugee families, ensuring the youngest and most vulnerable receive proper nutrition.", mealsPerFive: 50, childrenFed: 150, region: "middle-east", imageUrl: "/images/iraq.jpg", lat: 30.59, lng: 36.24 },
  { name: "Kenya", slug: "kenya", projectType: "Water & Well", description: "Building wells and providing clean water access alongside feeding programs for communities in Kenya.", mealsPerFive: 50, childrenFed: 400, region: "africa", imageUrl: "/images/kenya.jpg", lat: -0.02, lng: 37.91 },
  { name: "Lebanon", slug: "lebanon", projectType: "Feeding", description: "Feeding families affected by economic crisis and displacement in Lebanon.", mealsPerFive: 50, childrenFed: 250, region: "middle-east", imageUrl: "/images/lebanon.jpg", lat: 33.85, lng: 35.86 },
  { name: "Moldova", slug: "moldova", projectType: "Bread for the Poor", description: "Distributing fresh bread and essential food supplies to impoverished communities in Moldova.", mealsPerFive: 50, childrenFed: 120, region: "europe", imageUrl: "/images/moldova.jpg", lat: 47.41, lng: 28.37 },
  { name: "Nicaragua", slug: "nicaragua", projectType: "Feeding", description: "Providing meals and nutritional support to children and families in Nicaragua.", mealsPerFive: 50, childrenFed: 180, region: "americas", imageUrl: "/images/colombia.jpg", lat: 12.87, lng: -85.21 },
  { name: "Paraguay", slug: "paraguay", projectType: "Feeding", description: "Supporting feeding programs that reach underserved communities in Paraguay.", mealsPerFive: 50, childrenFed: 200, region: "americas", imageUrl: "/images/paraguay.jpg", lat: -23.44, lng: -58.44 },
  { name: "Philippines", slug: "philippines", projectType: "Meals for Children in the Slums", description: "Serving nutritious meals to children living in slum communities, bringing hope one plate at a time.", mealsPerFive: 50, childrenFed: 350, region: "asia", imageUrl: "/images/philippines.jpg", lat: 12.88, lng: 121.77 },
  { name: "Serbia", slug: "serbia", projectType: "Feeding", description: "Providing meals to vulnerable families and refugees in Serbia.", mealsPerFive: 50, childrenFed: 100, region: "europe", imageUrl: "/images/serbia.jpg", lat: 44.02, lng: 21.01 },
  { name: "Spain", slug: "spain", projectType: "Feeding", description: "Supporting feeding initiatives for immigrant communities and families in need across Spain.", mealsPerFive: 50, childrenFed: 150, region: "europe", imageUrl: "/images/spain.jpg", lat: 40.46, lng: -3.75 },
  { name: "Syria", slug: "syria", projectType: "Feeding", description: "Reaching families in Syria with critical food support during ongoing conflict and displacement.", mealsPerFive: 50, childrenFed: 300, region: "middle-east", imageUrl: "/images/iraq.jpg", lat: 34.80, lng: 38.99 },
  { name: "Turkey", slug: "turkey", projectType: "Syrian Refugees Outreach", description: "Serving Syrian refugee families in Turkey with meals, supplies, and community support.", mealsPerFive: 50, childrenFed: 400, region: "middle-east", imageUrl: "/images/turkey.jpg", lat: 38.96, lng: 35.24 },
  { name: "Uganda", slug: "uganda", projectType: "Feeding & Special Projects", description: "Combining feeding programs with special community projects to create lasting change in Uganda.", mealsPerFive: 50, childrenFed: 350, region: "africa", imageUrl: "/images/uganda.jpg", lat: 1.37, lng: 32.29 },
  { name: "Ukraine", slug: "ukraine", projectType: "Feeding", description: "Providing emergency food relief to families affected by conflict in Ukraine.", mealsPerFive: 50, childrenFed: 500, region: "europe", imageUrl: "/images/ukraine.jpg", lat: 48.38, lng: 31.17 },
  { name: "Venezuela", slug: "venezuela", projectType: "Feeding", description: "Feeding children and families amid the ongoing humanitarian crisis in Venezuela.", mealsPerFive: 50, childrenFed: 400, region: "americas", imageUrl: "/images/venezuela.jpg", lat: 6.42, lng: -66.59 },
];

export const heroImageUrl = "/images/hero.jpg";
export const logoUrl = "/images/hero.jpg";

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}
