import MediaBrowser from "@/components/MediaBrowser";
import { getHomepageVideo } from "@/lib/content";
import { getMediaSections } from "@/lib/videos";

export const metadata = {
  title: "Media | High5Give5",
  description:
    "Watch stories from the field — children's voices, partners, and the communities High5Give5 serves.",
};

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const [video, sections] = await Promise.all([
    getHomepageVideo(),
    getMediaSections(),
  ]);
  const featured = {
    label: video.sectionLabel,
    title: video.heading,
    videoUrl: video.videoUrl,
    posterImage: video.posterImage,
  };
  return <MediaBrowser featured={featured} sections={sections} />;
}
