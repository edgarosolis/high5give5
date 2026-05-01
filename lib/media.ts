import data from "./data/media-by-country.json";

export type MediaPhoto = {
  fileId: string;
  url: string;
  alt: string | null;
  source: "country-main" | "country-other" | "blog-thumbnail" | "blog-image";
  blogTitle?: string;
  blogSlug?: string;
  blogDate?: string;
};

export type CountryMedia = {
  name: string;
  slug: string;
  subtitle: string | null;
  cover: string | null;
  photoCount: number;
  photos: MediaPhoto[];
};

const countries = data as CountryMedia[];

export function getAllCountryMedia(): CountryMedia[] {
  return countries;
}

export function getCountryMedia(slug: string): CountryMedia | undefined {
  return countries.find((c) => c.slug === slug);
}

export function getCountryMediaSlugs(): string[] {
  return countries.map((c) => c.slug);
}
