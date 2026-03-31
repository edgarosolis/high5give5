"use client";

import { useState, useEffect, useCallback } from "react";
import SectionCard from "@/components/admin/SectionCard";
import FormField from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import ImageUpload from "@/components/admin/ImageUpload";
import Toast from "@/components/admin/Toast";

export default function HomepageAdminPage() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Hero section
  const [hero, setHero] = useState({
    heading: "Give $5 to a Higher Cause",
    tagline: "From those who have to those who need — join us feed the hungry and bring hope",
    backgroundImage: "/images/hero.jpg",
    ctaPrimaryText: "See Our Impact",
    ctaPrimaryLink: "#impact",
    ctaSecondaryText: "Donate Now",
    ctaSecondaryLink: "/donate",
  });
  const [heroLoading, setHeroLoading] = useState(false);

  // Story section
  const [story, setStory] = useState({
    sectionLabel: "Our Story",
    heading: "It Started With Two 7-Year-Olds and $5",
    bodyText: "",
    linkText: "Read Our Story",
    linkUrl: "/about",
  });
  const [storyLoading, setStoryLoading] = useState(false);

  // How It Works steps
  const [steps, setSteps] = useState([
    { iconName: "heart", title: "Give $5", description: "Make a simple $5 donation. That's all it takes to start changing lives around the world." },
    { iconName: "globe", title: "We Distribute Locally", description: "Our partners on the ground deliver food directly to communities in 22+ countries." },
    { iconName: "smile", title: "Lives Are Changed", description: "Children are fed, families gain hope, and communities grow stronger — one meal at a time." },
  ]);
  const [stepsLoading, setStepsLoading] = useState(false);

  // Video section
  const [video, setVideo] = useState({
    sectionLabel: "Watch Our Story",
    heading: "See the Impact of Your Generosity",
    videoUrl: "/images/story-video.mp4",
    posterImage: "/images/hero.jpg",
  });
  const [videoLoading, setVideoLoading] = useState(false);

  // Donate CTA
  const [donateCta, setDonateCta] = useState({
    heading: "Your $5 Can Change Everything",
    bodyText: "Every $5 donated provides 50 meals to those in need. 100% of your donation goes directly to feeding programs.",
    buttonText: "Donate Now",
    buttonLink: "/donate",
    footnote: "High 5 Give 5 is a 501(c)(3) nonprofit organization. All donations are tax deductible.",
  });
  const [donateLoading, setDonateLoading] = useState(false);

  // Load data
  useEffect(() => {
    const sections = [
      { key: "homepage-hero", setter: setHero },
      { key: "homepage-story", setter: setStory },
      { key: "homepage-video", setter: setVideo },
      { key: "homepage-donate-cta", setter: setDonateCta },
    ];

    sections.forEach(({ key, setter }) => {
      fetch(`/api/admin/settings?section=${key}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && Object.keys(data).length > 0) {
            setter((prev: Record<string, unknown>) => ({ ...prev, ...data }));
          }
        })
        .catch(() => {});
    });

    fetch("/api/admin/settings/steps")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSteps(data.map((s: Record<string, unknown>) => ({
            iconName: s.iconName as string || "",
            title: s.title as string || "",
            description: s.description as string || "",
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
      if (res.ok) {
        setToast({ message: "Saved!", type: "success" });
      } else {
        setToast({ message: "Failed to save", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to save", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const saveSteps = useCallback(async () => {
    setStepsLoading(true);
    try {
      const res = await fetch("/api/admin/settings/steps", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps }),
      });
      if (res.ok) {
        setToast({ message: "Steps saved!", type: "success" });
      } else {
        setToast({ message: "Failed to save steps", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to save steps", type: "error" });
    } finally {
      setStepsLoading(false);
    }
  }, [steps]);

  return (
    <div className="max-w-3xl space-y-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Homepage Content</h1>
        <p className="text-gray-500 mt-1">Manage all sections of the homepage.</p>
      </div>

      {/* Hero Section */}
      <SectionCard title="Hero Section" description="The main banner at the top of the page.">
        <FormField label="Heading" value={hero.heading} onChange={(v) => setHero({ ...hero, heading: v })} required />
        <FormField label="Tagline" type="textarea" value={hero.tagline} onChange={(v) => setHero({ ...hero, tagline: v })} rows={2} />
        <ImageUpload label="Background Image" value={hero.backgroundImage} onChange={(v) => setHero({ ...hero, backgroundImage: v })} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Primary CTA Text" value={hero.ctaPrimaryText} onChange={(v) => setHero({ ...hero, ctaPrimaryText: v })} />
          <FormField label="Primary CTA Link" value={hero.ctaPrimaryLink} onChange={(v) => setHero({ ...hero, ctaPrimaryLink: v })} />
          <FormField label="Secondary CTA Text" value={hero.ctaSecondaryText} onChange={(v) => setHero({ ...hero, ctaSecondaryText: v })} />
          <FormField label="Secondary CTA Link" value={hero.ctaSecondaryLink} onChange={(v) => setHero({ ...hero, ctaSecondaryLink: v })} />
        </div>
        <SaveButton loading={heroLoading} onClick={() => saveSection("homepage-hero", hero, setHeroLoading)} />
      </SectionCard>

      {/* Story Section */}
      <SectionCard title="Story Section" description="The founding story summary on the homepage.">
        <FormField label="Section Label" value={story.sectionLabel} onChange={(v) => setStory({ ...story, sectionLabel: v })} />
        <FormField label="Heading" value={story.heading} onChange={(v) => setStory({ ...story, heading: v })} required />
        <FormField label="Body Text" type="textarea" value={story.bodyText} onChange={(v) => setStory({ ...story, bodyText: v })} rows={5} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Link Text" value={story.linkText} onChange={(v) => setStory({ ...story, linkText: v })} />
          <FormField label="Link URL" value={story.linkUrl} onChange={(v) => setStory({ ...story, linkUrl: v })} />
        </div>
        <SaveButton loading={storyLoading} onClick={() => saveSection("homepage-story", story, setStoryLoading)} />
      </SectionCard>

      {/* How It Works */}
      <SectionCard title="How It Works" description="The three-step process cards.">
        {steps.map((step, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-600">Step {i + 1}</p>
            <FormField label="Icon" type="select" value={step.iconName} onChange={(v) => {
              const updated = [...steps];
              updated[i] = { ...updated[i], iconName: v };
              setSteps(updated);
            }} options={[
              { value: "heart", label: "Heart" },
              { value: "globe", label: "Globe" },
              { value: "smile", label: "Smile" },
              { value: "star", label: "Star" },
              { value: "hand", label: "Hand" },
            ]} />
            <FormField label="Title" value={step.title} onChange={(v) => {
              const updated = [...steps];
              updated[i] = { ...updated[i], title: v };
              setSteps(updated);
            }} required />
            <FormField label="Description" type="textarea" value={step.description} onChange={(v) => {
              const updated = [...steps];
              updated[i] = { ...updated[i], description: v };
              setSteps(updated);
            }} rows={2} />
          </div>
        ))}
        <SaveButton loading={stepsLoading} onClick={saveSteps} />
      </SectionCard>

      {/* Video Section */}
      <SectionCard title="Video Section" description="The video embed section.">
        <FormField label="Section Label" value={video.sectionLabel} onChange={(v) => setVideo({ ...video, sectionLabel: v })} />
        <FormField label="Heading" value={video.heading} onChange={(v) => setVideo({ ...video, heading: v })} required />
        <FormField label="Video URL" value={video.videoUrl} onChange={(v) => setVideo({ ...video, videoUrl: v })} />
        <ImageUpload label="Poster Image" value={video.posterImage} onChange={(v) => setVideo({ ...video, posterImage: v })} />
        <SaveButton loading={videoLoading} onClick={() => saveSection("homepage-video", video, setVideoLoading)} />
      </SectionCard>

      {/* Donate CTA */}
      <SectionCard title="Donate CTA" description="The call-to-action section at the bottom.">
        <FormField label="Heading" value={donateCta.heading} onChange={(v) => setDonateCta({ ...donateCta, heading: v })} required />
        <FormField label="Body Text" type="textarea" value={donateCta.bodyText} onChange={(v) => setDonateCta({ ...donateCta, bodyText: v })} rows={3} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Button Text" value={donateCta.buttonText} onChange={(v) => setDonateCta({ ...donateCta, buttonText: v })} />
          <FormField label="Button Link" value={donateCta.buttonLink} onChange={(v) => setDonateCta({ ...donateCta, buttonLink: v })} />
        </div>
        <FormField label="Footnote" type="textarea" value={donateCta.footnote} onChange={(v) => setDonateCta({ ...donateCta, footnote: v })} rows={2} />
        <SaveButton loading={donateLoading} onClick={() => saveSection("homepage-donate-cta", donateCta, setDonateLoading)} />
      </SectionCard>
    </div>
  );
}
