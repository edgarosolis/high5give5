"use client";

import { useState, useEffect } from "react";
import SectionCard from "@/components/admin/SectionCard";
import FormField from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import Toast from "@/components/admin/Toast";

export default function AboutAdminPage() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Founding Story
  const [story, setStory] = useState({
    heading: "How It Began",
    paragraphs: [
      "It started with a seven-year-old boy named Sam who had a heart bigger than his toy collection. One day, Sam decided to sell his toys -- not for a new video game or a bigger bike, but to feed children who were going hungry. Every dollar he raised went straight to feeding kids in need.",
      'A week later, a girl named Genevieve, also seven years old, sent a card with $5 tucked inside. Her message was simple but powerful: "Take a chance with 5 and see how much more arrives."',
      "That $5 became a prayer and a promise. They took a chance, and what arrived was nothing short of a miracle -- a movement that would grow to feed thousands of children across the globe.",
    ],
  });
  const [storyLoading, setStoryLoading] = useState(false);

  // Timeline
  const [timeline, setTimeline] = useState([
    { year: "2019", title: "Founded with $5", description: "Sam sold his toys and Genevieve sent a card with $5. A prayer, a chance, and a mission was born." },
    { year: "2020", title: "Expanded to 5 Countries", description: "From a single act of generosity, High 5 Give 5 grew to serve children in five countries across multiple continents." },
    { year: "2022", title: "Reached 15 Countries", description: "Our network of partners expanded rapidly, bringing meals and hope to children in 15 nations." },
    { year: "2024", title: "Serving 22+ Countries", description: "Now feeding over 6,000 children daily across more than 22 countries, with no signs of slowing down." },
  ]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  // Ministry Overview
  const [ministry, setMinistry] = useState({
    heading: "Ministry Overview",
    bodyText: "High 5 Give 5 operates in over 22 countries around the world, partnering with local organizations to feed children, support the elderly, and bring hope to communities in need.",
  });
  const [ministryLoading, setMinistryLoading] = useState(false);

  // Video
  const [video, setVideo] = useState({
    heading: "See Our Impact",
    videoUrl: "/images/story-video.mp4",
    posterImage: "/images/hero.jpg",
  });
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    const sections = [
      { key: "about-founding-story", setter: (d: Record<string, unknown>) => { if (d.heading) setStory(d as typeof story); } },
      { key: "about-ministry", setter: (d: Record<string, unknown>) => { if (d.heading) setMinistry(d as typeof ministry); } },
    ];

    sections.forEach(({ key, setter }) => {
      fetch(`/api/admin/settings?section=${key}`)
        .then((r) => r.json())
        .then((data) => { if (data && Object.keys(data).length > 0) setter(data); })
        .catch(() => {});
    });

    fetch("/api/admin/settings/timeline")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTimeline(data.map((e: Record<string, unknown>) => ({
            year: (e.year as string) || "",
            title: (e.title as string) || "",
            description: (e.description as string) || "",
          })));
        }
      })
      .catch(() => {});
  }, []);

  async function saveSection(section: string, data: Record<string, unknown>, setLoading: (v: boolean) => void) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      setToast({ message: res.ok ? "Saved!" : "Failed to save", type: res.ok ? "success" : "error" });
    } catch {
      setToast({ message: "Failed to save", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function saveTimeline() {
    setTimelineLoading(true);
    try {
      const res = await fetch("/api/admin/settings/timeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: timeline }),
      });
      setToast({ message: res.ok ? "Timeline saved!" : "Failed to save", type: res.ok ? "success" : "error" });
    } catch {
      setToast({ message: "Failed to save", type: "error" });
    } finally {
      setTimelineLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">About Page</h1>
        <p className="text-gray-500 mt-1">Manage the About page content.</p>
      </div>

      {/* Founding Story */}
      <SectionCard title="Founding Story" description="The main narrative about Sam and Genevieve.">
        <FormField label="Heading" value={story.heading} onChange={(v) => setStory({ ...story, heading: v })} required />
        {story.paragraphs.map((p, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex-1">
              <FormField
                label={`Paragraph ${i + 1}`}
                type="textarea"
                value={p}
                onChange={(v) => {
                  const updated = [...story.paragraphs];
                  updated[i] = v;
                  setStory({ ...story, paragraphs: updated });
                }}
                rows={3}
              />
            </div>
            {story.paragraphs.length > 1 && (
              <button
                onClick={() => setStory({ ...story, paragraphs: story.paragraphs.filter((_, j) => j !== i) })}
                className="mt-7 text-red-400 hover:text-red-600 text-sm self-start"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => setStory({ ...story, paragraphs: [...story.paragraphs, ""] })}
          className="text-sm text-[#2A9D8F] hover:text-[#1A7A6E] font-medium"
        >
          + Add Paragraph
        </button>
        <SaveButton loading={storyLoading} onClick={() => saveSection("about-founding-story", story, setStoryLoading)} />
      </SectionCard>

      {/* Timeline */}
      <SectionCard title="Timeline" description="Key milestones in the organization's history.">
        {timeline.map((entry, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-600">Entry {i + 1}</p>
              <button
                onClick={() => setTimeline(timeline.filter((_, j) => j !== i))}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Year" value={entry.year} onChange={(v) => {
                const updated = [...timeline];
                updated[i] = { ...updated[i], year: v };
                setTimeline(updated);
              }} required />
              <FormField label="Title" value={entry.title} onChange={(v) => {
                const updated = [...timeline];
                updated[i] = { ...updated[i], title: v };
                setTimeline(updated);
              }} required />
            </div>
            <FormField label="Description" type="textarea" value={entry.description} onChange={(v) => {
              const updated = [...timeline];
              updated[i] = { ...updated[i], description: v };
              setTimeline(updated);
            }} rows={2} />
          </div>
        ))}
        <button
          onClick={() => setTimeline([...timeline, { year: "", title: "", description: "" }])}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:border-[#2A9D8F] hover:text-[#2A9D8F] transition-colors"
        >
          + Add Timeline Entry
        </button>
        <SaveButton loading={timelineLoading} onClick={saveTimeline} />
      </SectionCard>

      {/* Ministry Overview */}
      <SectionCard title="Ministry Overview">
        <FormField label="Heading" value={ministry.heading} onChange={(v) => setMinistry({ ...ministry, heading: v })} required />
        <FormField label="Body Text" type="textarea" value={ministry.bodyText} onChange={(v) => setMinistry({ ...ministry, bodyText: v })} rows={5} />
        <SaveButton loading={ministryLoading} onClick={() => saveSection("about-ministry", ministry, setMinistryLoading)} />
      </SectionCard>

      {/* Video */}
      <SectionCard title="Video Section">
        <FormField label="Heading" value={video.heading} onChange={(v) => setVideo({ ...video, heading: v })} />
        <FormField label="Video URL" value={video.videoUrl} onChange={(v) => setVideo({ ...video, videoUrl: v })} />
        <FormField label="Poster Image URL" value={video.posterImage} onChange={(v) => setVideo({ ...video, posterImage: v })} />
        <SaveButton loading={videoLoading} onClick={() => {
          // Save as about-specific video (reuse homepage video section key or add a new one)
          // For now, we'll save it alongside the about page settings
          saveSection("about-ministry", { ...ministry, videoHeading: video.heading, videoUrl: video.videoUrl, posterImage: video.posterImage }, setVideoLoading);
        }} />
      </SectionCard>
    </div>
  );
}
