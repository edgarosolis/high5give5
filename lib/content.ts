import { getItem, queryByPK, queryBySKPrefix } from "./dynamo";
import { countries as hardcodedCountries } from "./countries";
import type {
  GlobalStats,
  HeroContent,
  StoryContent,
  HowItWorksStep,
  VideoContent,
  DonateCTAContent,
  TimelineEntry,
  FoundingStory,
  MinistryOverview,
  ContactInfo,
  Country,
} from "./types";

// ─── Defaults (fallbacks if DynamoDB is unreachable) ─────────────

const DEFAULT_GLOBAL_STATS: GlobalStats = {
  countriesServed: 22,
  childrenFed: 6000,
  elderlyServed: 2000,
  mealsPerFive: 50,
};

const DEFAULT_HERO: HeroContent = {
  heading: "Give $5 to a Higher Cause",
  tagline: "From those who have to those who need — join us feed the hungry and bring hope",
  backgroundImage: "/images/hero.jpg",
  ctaPrimaryText: "See Our Impact",
  ctaPrimaryLink: "#impact",
  ctaSecondaryText: "Donate Now",
  ctaSecondaryLink: "/donate",
};

const DEFAULT_STORY: StoryContent = {
  sectionLabel: "Our Story",
  heading: "It Started With Two 7-Year-Olds and $5",
  bodyText:
    'It all began when Sam, just 7 years old, sold his toys to raise money to feed the poor. Around the same time, a little girl named Genevieve, also 7, sent a handwritten card along with $5, with a simple message: "Take a chance with 5." Their compassion sparked a movement — proving that even the smallest gift can make the biggest difference. Today, High 5 Give 5 carries that spirit forward, turning every $5 into 50 meals for those in need around the world.',
  linkText: "Read Our Story",
  linkUrl: "/about",
};

const DEFAULT_HOW_IT_WORKS: HowItWorksStep[] = [
  {
    iconName: "heart",
    title: "Give $5",
    description: "Make a simple $5 donation. That's all it takes to start changing lives around the world.",
    order: 1,
  },
  {
    iconName: "globe",
    title: "We Distribute Locally",
    description: "Our partners on the ground deliver food directly to communities in 22+ countries.",
    order: 2,
  },
  {
    iconName: "smile",
    title: "Lives Are Changed",
    description: "Children are fed, families gain hope, and communities grow stronger — one meal at a time.",
    order: 3,
  },
];

const DEFAULT_VIDEO: VideoContent = {
  sectionLabel: "Watch Our Story",
  heading: "See the Impact of Your Generosity",
  videoUrl: "/images/story-video.mp4",
  posterImage: "/images/hero.jpg",
};

const DEFAULT_DONATE_CTA: DonateCTAContent = {
  heading: "Your $5 Can Change Everything",
  bodyText: "Every $5 donated provides 50 meals to those in need. 100% of your donation goes directly to feeding programs.",
  buttonText: "Donate Now",
  buttonLink: "/donate",
  footnote: "High 5 Give 5 is a 501(c)(3) nonprofit organization. All donations are tax deductible.",
};

const DEFAULT_FOUNDING_STORY: FoundingStory = {
  heading: "How It Began",
  paragraphs: [
    "It started with a seven-year-old boy named Sam who had a heart bigger than his toy collection. One day, Sam decided to sell his toys -- not for a new video game or a bigger bike, but to feed children who were going hungry. Every dollar he raised went straight to feeding kids in need.",
    'A week later, a girl named Genevieve, also seven years old, sent a card with $5 tucked inside. Her message was simple but powerful: "Take a chance with 5 and see how much more arrives."',
    "That $5 became a prayer and a promise. They took a chance, and what arrived was nothing short of a miracle -- a movement that would grow to feed thousands of children across the globe.",
  ],
};

const DEFAULT_TIMELINE: TimelineEntry[] = [
  { year: "2019", title: "Founded with $5", description: "Sam sold his toys and Genevieve sent a card with $5. A prayer, a chance, and a mission was born.", order: 1 },
  { year: "2020", title: "Expanded to 5 Countries", description: "From a single act of generosity, High 5 Give 5 grew to serve children in five countries across multiple continents.", order: 2 },
  { year: "2022", title: "Reached 15 Countries", description: "Our network of partners expanded rapidly, bringing meals and hope to children in 15 nations.", order: 3 },
  { year: "2024", title: "Serving 22+ Countries", description: "Now feeding over 6,000 children daily across more than 22 countries, with no signs of slowing down.", order: 4 },
];

const DEFAULT_MINISTRY: MinistryOverview = {
  heading: "Ministry Overview",
  bodyText: "High 5 Give 5 operates in over 22 countries around the world, partnering with local organizations to feed children, support the elderly, and bring hope to communities in need. From Europe to Asia, Africa to the Americas, and across the Middle East, our mission remains the same: take a chance with $5 and watch lives transform.",
};

const DEFAULT_CONTACT: ContactInfo = {
  email: "info@high5give5.org",
  locationText: "Serving 22+ countries worldwide",
  socialLinks: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
    twitter: "#",
  },
};

// ─── Fetch Functions ─────────────

export async function getGlobalStats(): Promise<GlobalStats> {
  try {
    const item = await getItem("SETTINGS", "GLOBAL_STATS");
    if (item) {
      return {
        countriesServed: item.countriesServed ?? DEFAULT_GLOBAL_STATS.countriesServed,
        childrenFed: item.childrenFed ?? DEFAULT_GLOBAL_STATS.childrenFed,
        elderlyServed: item.elderlyServed ?? DEFAULT_GLOBAL_STATS.elderlyServed,
        mealsPerFive: item.mealsPerFive ?? DEFAULT_GLOBAL_STATS.mealsPerFive,
      };
    }
  } catch (error) {
    console.error("Failed to fetch global stats:", error);
  }
  return DEFAULT_GLOBAL_STATS;
}

export async function getHomepageHero(): Promise<HeroContent> {
  try {
    const item = await getItem("SETTINGS", "HOMEPAGE_HERO");
    if (item) return { ...DEFAULT_HERO, ...item } as HeroContent;
  } catch (error) {
    console.error("Failed to fetch hero content:", error);
  }
  return DEFAULT_HERO;
}

export async function getHomepageStory(): Promise<StoryContent> {
  try {
    const item = await getItem("SETTINGS", "HOMEPAGE_STORY");
    if (item) return { ...DEFAULT_STORY, ...item } as StoryContent;
  } catch (error) {
    console.error("Failed to fetch story content:", error);
  }
  return DEFAULT_STORY;
}

export async function getHowItWorksSteps(): Promise<HowItWorksStep[]> {
  try {
    const items = await queryBySKPrefix("SETTINGS", "HOMEPAGE_STEP#");
    if (items.length > 0) {
      return (items as unknown as HowItWorksStep[]).sort((a, b) => a.order - b.order);
    }
  } catch (error) {
    console.error("Failed to fetch how it works steps:", error);
  }
  return DEFAULT_HOW_IT_WORKS;
}

export async function getHomepageVideo(): Promise<VideoContent> {
  try {
    const item = await getItem("SETTINGS", "HOMEPAGE_VIDEO");
    if (item) return { ...DEFAULT_VIDEO, ...item } as VideoContent;
  } catch (error) {
    console.error("Failed to fetch video content:", error);
  }
  return DEFAULT_VIDEO;
}

export async function getDonateCTA(): Promise<DonateCTAContent> {
  try {
    const item = await getItem("SETTINGS", "HOMEPAGE_DONATE_CTA");
    if (item) return { ...DEFAULT_DONATE_CTA, ...item } as DonateCTAContent;
  } catch (error) {
    console.error("Failed to fetch donate CTA:", error);
  }
  return DEFAULT_DONATE_CTA;
}

export async function getFoundingStory(): Promise<FoundingStory> {
  try {
    const item = await getItem("SETTINGS", "ABOUT_FOUNDING_STORY");
    if (item) return { ...DEFAULT_FOUNDING_STORY, ...item } as FoundingStory;
  } catch (error) {
    console.error("Failed to fetch founding story:", error);
  }
  return DEFAULT_FOUNDING_STORY;
}

export async function getTimelineEntries(): Promise<TimelineEntry[]> {
  try {
    const items = await queryBySKPrefix("SETTINGS", "ABOUT_TIMELINE#");
    if (items.length > 0) {
      return (items as unknown as TimelineEntry[]).sort((a, b) => a.order - b.order);
    }
  } catch (error) {
    console.error("Failed to fetch timeline:", error);
  }
  return DEFAULT_TIMELINE;
}

export async function getMinistryOverview(): Promise<MinistryOverview> {
  try {
    const item = await getItem("SETTINGS", "ABOUT_MINISTRY");
    if (item) return { ...DEFAULT_MINISTRY, ...item } as MinistryOverview;
  } catch (error) {
    console.error("Failed to fetch ministry overview:", error);
  }
  return DEFAULT_MINISTRY;
}

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const item = await getItem("SETTINGS", "CONTACT_INFO");
    if (item) return { ...DEFAULT_CONTACT, ...item } as ContactInfo;
  } catch (error) {
    console.error("Failed to fetch contact info:", error);
  }
  return DEFAULT_CONTACT;
}

export async function getAllCountries(): Promise<Country[]> {
  try {
    const items = await queryByPK("COUNTRY");
    if (items.length > 0) {
      return (items as unknown as Country[]).sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch (error) {
    console.error("Failed to fetch countries:", error);
  }
  return hardcodedCountries;
}

export async function getCountryBySlug(slug: string): Promise<Country | undefined> {
  try {
    const item = await getItem("COUNTRY", slug);
    if (item) return item as unknown as Country;
  } catch (error) {
    console.error("Failed to fetch country:", error);
  }
  return hardcodedCountries.find((c) => c.slug === slug);
}

// Re-export defaults for use in admin forms and seeding
export {
  DEFAULT_GLOBAL_STATS,
  DEFAULT_HERO,
  DEFAULT_STORY,
  DEFAULT_HOW_IT_WORKS,
  DEFAULT_VIDEO,
  DEFAULT_DONATE_CTA,
  DEFAULT_FOUNDING_STORY,
  DEFAULT_TIMELINE,
  DEFAULT_MINISTRY,
  DEFAULT_CONTACT,
};
