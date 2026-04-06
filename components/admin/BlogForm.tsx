"use client";

import { useState, useEffect } from "react";
import SectionCard from "./SectionCard";
import FormField from "./FormField";
import SaveButton from "./SaveButton";
import ImageUpload from "./ImageUpload";
import MultiImageUpload from "./MultiImageUpload";
import RichTextEditor from "./RichTextEditor";
import Toast from "./Toast";

interface BlogData {
  title: string;
  slug: string;
  body: string;
  countrySlug: string;
  countryName: string;
  heroImage: string;
  images: string[];
  youtubeUrl: string;
  publishedAt: string;
}

interface CountryOption {
  slug: string;
  name: string;
}

interface BlogFormProps {
  initialData?: Partial<BlogData>;
  isNew?: boolean;
  onSave: (data: BlogData) => Promise<boolean>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/
  );
  return match ? match[1] : null;
}

export default function BlogForm({ initialData, isNew, onSave }: BlogFormProps) {
  const [data, setData] = useState<BlogData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    body: initialData?.body || "",
    countrySlug: initialData?.countrySlug || "",
    countryName: initialData?.countryName || "",
    heroImage: initialData?.heroImage || "",
    images: initialData?.images || [],
    youtubeUrl: initialData?.youtubeUrl || "",
    publishedAt: initialData?.publishedAt || new Date().toISOString().split("T")[0],
  });
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [postToFacebook, setPostToFacebook] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/countries")
      .then((r) => r.json())
      .then((list: CountryOption[]) => setCountries(list))
      .catch(() => {});
  }, []);

  function handleTitleChange(title: string) {
    const updates: Partial<BlogData> = { title };
    if (isNew) {
      updates.slug = slugify(title);
    }
    setData({ ...data, ...updates });
  }

  function handleCountryChange(slug: string) {
    const country = countries.find((c) => c.slug === slug);
    setData({
      ...data,
      countrySlug: slug,
      countryName: country?.name || "",
    });
  }

  async function handleSubmit() {
    if (!data.title || !data.slug || !data.countrySlug || !data.body) {
      setToast({
        message: "Please fill in title, country, and body",
        type: "error",
      });
      return;
    }

    setLoading(true);
    const success = await onSave(data);
    setLoading(false);

    if (success) {
      setToast({ message: "Blog post saved!", type: "success" });

      // Post to Facebook if toggled
      if (postToFacebook) {
        try {
          const siteUrl = window.location.origin;
          const link = `${siteUrl}/our-work/${data.countrySlug}`;
          const fbRes = await fetch("/api/admin/facebook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `${data.title}\n\n${data.body}`,
              link,
              imageUrl: data.images[0] || undefined,
            }),
          });
          const fbData = await fbRes.json();
          if (fbData.success) {
            setToast({ message: "Saved & posted to Facebook!", type: "success" });
          } else {
            setToast({ message: `Saved, but Facebook failed: ${fbData.error}`, type: "error" });
          }
        } catch {
          setToast({ message: "Saved, but Facebook post failed", type: "error" });
        }
        setPostToFacebook(false);
      }
    } else {
      setToast({ message: "Failed to save", type: "error" });
    }
  }

  const youtubeId = data.youtubeUrl ? extractYoutubeId(data.youtubeUrl) : null;

  return (
    <div className="max-w-3xl space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <SaveButton loading={loading} onClick={handleSubmit} />
        {!isNew && data.slug && (
          <a
            href={`/blog/${data.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#2A9D8F] hover:underline"
          >
            View Post ↗
          </a>
        )}
      </div>

      <SectionCard title="Post Details">
        <FormField
          label="Title"
          value={data.title}
          onChange={handleTitleChange}
          required
          placeholder="e.g. New Well Completed in Honduras"
        />
        <FormField
          label="Slug"
          value={data.slug}
          onChange={(v) =>
            setData({ ...data, slug: isNew ? slugify(v) : data.slug })
          }
          placeholder="auto-generated-from-title"
          required
        />
        <FormField
          label="Country"
          type="select"
          value={data.countrySlug}
          onChange={handleCountryChange}
          required
          options={countries.map((c) => ({ value: c.slug, label: c.name }))}
        />
        <FormField
          label="Publish Date"
          type="date"
          value={data.publishedAt}
          onChange={(v) => setData({ ...data, publishedAt: v })}
          required
        />
      </SectionCard>

      <SectionCard title="Content" description="Write the blog post content. What you write here is how it will look on the website.">
        <RichTextEditor
          label=""
          value={data.body}
          onChange={(v) => setData({ ...data, body: v })}
          placeholder="Write the blog post content here..."
          minHeight="250px"
        />
      </SectionCard>

      <SectionCard title="Hero Image" description="The main banner image shown at the top of the blog post.">
        <ImageUpload
          label="Hero Image"
          value={data.heroImage}
          onChange={(v) => setData({ ...data, heroImage: v })}
        />
      </SectionCard>

      <SectionCard title="Photos" description="Additional images displayed in the post. You can upload multiple at once.">
        <MultiImageUpload
          label="Post Photos"
          values={data.images}
          onChange={(images) => setData({ ...data, images })}
        />
      </SectionCard>

      <SectionCard title="Video">
        <FormField
          label="YouTube Video URL (optional)"
          value={data.youtubeUrl}
          onChange={(v) => setData({ ...data, youtubeUrl: v })}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {youtubeId && (
          <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-gray-200">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              className="w-full h-full"
              allowFullScreen
              title="YouTube preview"
            />
          </div>
        )}
      </SectionCard>

      <SectionCard title="Publishing">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={postToFacebook}
            onChange={(e) => setPostToFacebook(e.target.checked)}
            className="w-4 h-4 text-[#2A9D8F] rounded border-gray-300 focus:ring-[#2A9D8F]"
          />
          <span className="text-sm text-gray-700">
            Post to Facebook when saving
          </span>
        </label>
        <p className="text-xs text-gray-400 mt-1">
          Creates a Facebook post with the blog title, body, first image, and a link to the country page.
        </p>
      </SectionCard>

      <SaveButton loading={loading} onClick={handleSubmit} />
    </div>
  );
}
