"use client";

import { useEffect, useState } from "react";
import FormField from "./FormField";
import ImageUpload from "./ImageUpload";
import SaveButton from "./SaveButton";
import SectionCard from "./SectionCard";
import Toast from "./Toast";
import VideoUpload from "./VideoUpload";

export type VideoSection = "stories" | "founders" | "children";

export type VideoData = {
  slug: string;
  name: string;
  kind: "embed" | "file";
  externalUrl: string;
  fileUrl: string;
  thumbnail: string;
  description: string;
  section: VideoSection;
  countrySlug: string;
  order: number;
};

const SECTION_OPTIONS: { value: VideoSection; label: string }[] = [
  { value: "stories", label: "Stories (by country)" },
  { value: "founders", label: "Founders & Tributes" },
  { value: "children", label: "Children's Voices" },
];

type CountryOption = { slug: string; name: string; archived?: boolean };

// Local section inference for legacy videos that only carry a categorySlug.
function inferSection(categorySlug?: string): VideoSection {
  const s = (categorySlug || "").toLowerCase();
  if (s.includes("child")) return "children";
  if (s.includes("found") || s.includes("tribut")) return "founders";
  return "stories";
}

interface VideoFormProps {
  initial?: Partial<VideoData> & { categorySlug?: string };
  isNew?: boolean;
  onSave: (data: VideoData) => Promise<{ ok: boolean; error?: string }>;
  onDelete?: () => Promise<boolean>;
}

export default function VideoForm({ initial, isNew, onSave, onDelete }: VideoFormProps) {
  const [data, setData] = useState<VideoData>({
    slug: initial?.slug || "",
    name: initial?.name || "",
    kind: initial?.kind || "embed",
    externalUrl: initial?.externalUrl || "",
    fileUrl: initial?.fileUrl || "",
    thumbnail: initial?.thumbnail || "",
    description: initial?.description || "",
    section: initial?.section || inferSection(initial?.categorySlug),
    // Legacy stories videos store the country in categorySlug.
    countrySlug:
      initial?.countrySlug ??
      (initial?.categorySlug && initial.categorySlug !== "more-stories"
        ? initial.categorySlug
        : ""),
    order: initial?.order ?? 0,
  });
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/admin/countries")
      .then((r) => r.json())
      .then((items: CountryOption[]) => {
        setCountries(
          [...items].sort((a, b) => a.name.localeCompare(b.name))
        );
      })
      .catch(() => {});
  }, []);

  function update<K extends keyof VideoData>(key: K, value: VideoData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    const res = await onSave(data);
    setLoading(false);
    if (res.ok) {
      setToast({ message: isNew ? "Video created" : "Video saved", type: "success" });
    } else {
      setToast({ message: res.error || "Save failed", type: "error" });
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    if (!confirm("Delete this video? This cannot be undone.")) return;
    setDeleting(true);
    const ok = await onDelete();
    setDeleting(false);
    if (!ok) setToast({ message: "Delete failed", type: "error" });
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Details" description="Title, description, and where this video belongs.">
        <FormField
          label="Title"
          value={data.name}
          onChange={(v) => update("name", v)}
          required
        />
        <FormField
          label="Description"
          type="textarea"
          rows={3}
          value={data.description}
          onChange={(v) => update("description", v)}
        />
        <FormField
          label="Section"
          type="select"
          value={data.section}
          onChange={(v) => update("section", v as VideoSection)}
          required
          options={SECTION_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
        />
        {data.section === "stories" && (
          <FormField
            label="Country"
            type="select"
            value={data.countrySlug}
            onChange={(v) => update("countrySlug", v)}
            options={[
              { value: "", label: "— No country (More Stories) —" },
              ...countries.map((c) => ({
                value: c.slug,
                label: c.archived ? `${c.name} (hidden)` : c.name,
              })),
            ]}
          />
        )}
        <FormField
          label="Display order within section"
          type="number"
          value={data.order}
          onChange={(v) => update("order", Number(v) || 0)}
        />
      </SectionCard>

      <SectionCard
        title="Source"
        description="Either link to a YouTube/Vimeo video, or upload an mp4."
      >
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => update("kind", "embed")}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              data.kind === "embed"
                ? "bg-[#2A9D8F] border-[#2A9D8F] text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            YouTube / Vimeo URL
          </button>
          <button
            type="button"
            onClick={() => update("kind", "file")}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              data.kind === "file"
                ? "bg-[#2A9D8F] border-[#2A9D8F] text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Direct video upload
          </button>
        </div>

        {data.kind === "embed" ? (
          <FormField
            label="YouTube or Vimeo URL"
            value={data.externalUrl}
            onChange={(v) => update("externalUrl", v)}
            placeholder="https://www.youtube.com/watch?v=… or https://vimeo.com/…"
            required
          />
        ) : (
          <VideoUpload
            value={data.fileUrl}
            onChange={(v) => update("fileUrl", v)}
            label="Video file"
          />
        )}
      </SectionCard>

      <SectionCard title="Thumbnail" description="Shown in the carousel and as the modal poster.">
        <ImageUpload
          label="Thumbnail image"
          value={data.thumbnail}
          onChange={(v) => update("thumbnail", v)}
        />
        {data.kind === "embed" && data.externalUrl && !data.thumbnail && (
          <p className="text-xs text-gray-500">
            For YouTube videos, leave blank to auto-fill from i.ytimg.com.
          </p>
        )}
      </SectionCard>

      <div className="flex items-center justify-between">
        <SaveButton
          loading={loading}
          onClick={handleSave}
          label={isNew ? "Create video" : "Save changes"}
        />
        {!isNew && onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete video"}
          </button>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
