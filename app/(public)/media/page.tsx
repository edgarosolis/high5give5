import MediaBrowser from "@/components/MediaBrowser";
import { getFeaturedVideo, getVideosByCategory } from "@/lib/videos";

export const metadata = {
  title: "Media | High5Give5",
  description:
    "Watch stories from the field — children's voices, partners, and the communities High5Give5 serves.",
};

export default function MediaPage() {
  const featured = getFeaturedVideo();
  const categories = getVideosByCategory();
  return <MediaBrowser featured={featured} categories={categories} />;
}
