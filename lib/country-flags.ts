// Maps country slugs (as used in URLs and CMS) to ISO 3166-1 alpha-2 codes
// for use with flagcdn.com (e.g. https://flagcdn.com/w320/us.png).
const SLUG_TO_ISO2: Record<string, string> = {
  afghanistan: "af",
  albania: "al",
  armenia: "am",
  belarus: "by",
  colombia: "co",
  croatia: "hr",
  "el-salvador": "sv",
  greece: "gr",
  india: "in",
  iraq: "iq",
  italy: "it",
  jordan: "jo",
  kenya: "ke",
  lebanon: "lb",
  moldova: "md",
  nicaragua: "ni",
  paraguay: "py",
  philippines: "ph",
  serbia: "rs",
  spain: "es",
  syria: "sy",
  turkey: "tr",
  uganda: "ug",
  ukraine: "ua",
  usa: "us",
  venezuela: "ve",
};

export function getCountryFlagUrl(slug: string): string | null {
  const code = SLUG_TO_ISO2[slug.toLowerCase()];
  return code ? `https://flagcdn.com/w320/${code}.png` : null;
}
