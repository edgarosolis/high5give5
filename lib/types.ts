export interface GlobalStats {
  countriesServed: number;
  childrenFed: number;
  elderlyServed: number;
  mealsPerFive: number;
}

export interface HeroContent {
  heading: string;
  tagline: string;
  backgroundImage: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
}

export interface StoryContent {
  sectionLabel: string;
  heading: string;
  bodyText: string;
  linkText: string;
  linkUrl: string;
}

export interface HowItWorksStep {
  iconName: string;
  title: string;
  description: string;
  order: number;
}

export interface VideoContent {
  sectionLabel: string;
  heading: string;
  videoUrl: string;
  posterImage: string;
}

export interface DonateCTAContent {
  heading: string;
  bodyText: string;
  buttonText: string;
  buttonLink: string;
  footnote: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  order: number;
}

export interface FoundingStory {
  heading: string;
  paragraphs: string[];
}

export interface MinistryOverview {
  heading: string;
  bodyText: string;
}

export interface ContactInfo {
  email: string;
  locationText: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
  };
}

export interface CountrySection {
  title: string;
  content?: string;
  bullets?: string[];
}

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
  partner?: string;
  intro?: string;
  sections?: CountrySection[];
}

export interface BlogPost {
  slug: string;
  title: string;
  body: string;
  countrySlug: string;
  countryName: string;
  images: string[];
  youtubeUrl?: string;
  publishedAt: string;
  facebookPostId?: string;
}
