"use client";

import { useState, useCallback } from "react";
import SectionCard from "./SectionCard";
import FormField from "./FormField";
import SaveButton from "./SaveButton";
import ImageUpload from "./ImageUpload";
import RichTextEditor from "./RichTextEditor";
import Toast from "./Toast";

interface CountrySection {
  title: string;
  content?: string;
  bullets?: string[];
}

interface CountryData {
  name: string;
  tagline: string;
  slug: string;
  projectType: string;
  imageUrl: string;
  description: string;
  intro: string;
  mealsPerFive: number;
  childrenFed: number;
  region: string;
  lat: number;
  lng: number;
  partner: string;
  sections: CountrySection[];
}

interface CountryFormProps {
  initialData?: Partial<CountryData>;
  isNew?: boolean;
  onSave: (data: CountryData) => Promise<boolean>;
}

const REGION_OPTIONS = [
  { value: "europe", label: "Europe" },
  { value: "americas", label: "Americas" },
  { value: "africa", label: "Africa" },
  { value: "asia", label: "Asia" },
  { value: "middle-east", label: "Middle East" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CountryForm({ initialData, isNew, onSave }: CountryFormProps) {
  const [data, setData] = useState<CountryData>({
    name: initialData?.name || "",
    tagline: initialData?.tagline || "",
    slug: initialData?.slug || "",
    projectType: initialData?.projectType || "",
    imageUrl: initialData?.imageUrl || "",
    description: initialData?.description || "",
    intro: initialData?.intro || "",
    mealsPerFive: initialData?.mealsPerFive || 50,
    childrenFed: initialData?.childrenFed || 0,
    region: initialData?.region || "",
    lat: initialData?.lat || 0,
    lng: initialData?.lng || 0,
    partner: initialData?.partner || "",
    sections: initialData?.sections || [],
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [geocoding, setGeocoding] = useState(false);

  const geocodeLocation = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { "User-Agent": "High5Give5Admin/1.0" } }
      );
      const results = await res.json();
      if (results.length > 0) {
        setData((prev) => ({
          ...prev,
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        }));
        setToast({ message: `Location set: ${results[0].display_name.split(",").slice(0, 2).join(",")}`, type: "success" });
      } else {
        setToast({ message: "Location not found. Try a different search.", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to look up location.", type: "error" });
    } finally {
      setGeocoding(false);
    }
  }, []);

  function handleNameChange(name: string) {
    const updates: Partial<CountryData> = { name };
    if (isNew) {
      updates.slug = slugify(name);
    }
    setData({ ...data, ...updates });
  }

  async function handleSubmit() {
    if (!data.name || !data.slug || !data.projectType || !data.region) {
      setToast({ message: "Please fill in all required fields", type: "error" });
      return;
    }

    setLoading(true);
    const success = await onSave(data);
    setLoading(false);

    if (success) {
      setToast({ message: "Country saved!", type: "success" });
    } else {
      setToast({ message: "Failed to save", type: "error" });
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <SaveButton loading={loading} onClick={handleSubmit} />
        {!isNew && data.slug && (
          <a
            href={`/our-work/${data.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#2A9D8F] hover:underline"
          >
            View on Site ↗
          </a>
        )}
      </div>

      {/* 1. Country Info */}
      <SectionCard title="Country Info">
        <FormField label="Name" value={data.name} onChange={handleNameChange} required />
        <FormField
          label="Tagline"
          value={data.tagline}
          onChange={(v) => setData({ ...data, tagline: v })}
          placeholder="Short tagline shown under the country name (e.g. Bringing hope to families in need)"
        />
      </SectionCard>

      {/* 2. Slug & Project Type */}
      <SectionCard title="Project Details">
        <FormField
          label="Slug"
          value={data.slug}
          onChange={(v) => setData({ ...data, slug: isNew ? slugify(v) : data.slug })}
          placeholder="auto-generated-from-name"
          required
        />
        <FormField
          label="Project Type"
          value={data.projectType}
          onChange={(v) => setData({ ...data, projectType: v })}
          required
          placeholder="e.g. Feeding, Water & Well, School Supplies"
        />
        <FormField label="Region" type="select" value={data.region} onChange={(v) => setData({ ...data, region: v })} required options={REGION_OPTIONS} />
        <FormField label="Partner Organization" value={data.partner} onChange={(v) => setData({ ...data, partner: v })} placeholder="e.g. Ancora International (optional)" />
      </SectionCard>

      {/* 3. Hero Image */}
      <SectionCard title="Hero Image" description="Drag and drop or click to upload the main country image.">
        <ImageUpload
          label="Country Image"
          value={data.imageUrl}
          onChange={(v) => setData({ ...data, imageUrl: v })}
        />
      </SectionCard>

      {/* 4. Project Introduction (rich text) */}
      <SectionCard title="Project Introduction" description="A short introduction shown at the top of the country page and on country cards. What you write here is how it will look on the website.">
        <RichTextEditor
          label=""
          value={data.description}
          onChange={(v) => setData({ ...data, description: v })}
          placeholder="Write a short introduction about the project in this country..."
          minHeight="120px"
        />
      </SectionCard>

      {/* 5. Impact Stats */}
      <SectionCard title="Impact Stats">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Meals per $5" type="number" value={data.mealsPerFive} onChange={(v) => setData({ ...data, mealsPerFive: Number(v) })} required />
          <FormField label="Children Currently Fed" type="number" value={data.childrenFed} onChange={(v) => setData({ ...data, childrenFed: Number(v) })} required />
        </div>
      </SectionCard>

      {/* 6. Project Description (rich text, longer) */}
      <SectionCard title="Project Description" description="The full story of the project. Use headings, bold, lists to structure the content. This is how it will appear on the website.">
        <RichTextEditor
          label=""
          value={data.intro}
          onChange={(v) => setData({ ...data, intro: v })}
          placeholder="Write the detailed project description..."
          minHeight="300px"
        />
      </SectionCard>

      {/* 7. Map Location */}
      <SectionCard title="Map Location" description="Search by city or country name to set the map pin.">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City / Country
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); geocodeLocation(locationQuery); } }}
              placeholder={data.name ? `e.g. Tirana, ${data.name}` : "e.g. Tirana, Albania"}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => geocodeLocation(locationQuery)}
              disabled={geocoding || !locationQuery.trim()}
              className="px-4 py-2 bg-[#264653] text-white text-sm font-medium rounded-lg hover:bg-[#1a3540] disabled:opacity-50 transition-colors"
            >
              {geocoding ? "..." : "Find"}
            </button>
          </div>
        </div>
        {(data.lat !== 0 || data.lng !== 0) && (
          <p className="text-sm text-gray-500">
            📍 Coordinates: {data.lat.toFixed(4)}, {data.lng.toFixed(4)}
          </p>
        )}
      </SectionCard>

      <SaveButton loading={loading} onClick={handleSubmit} />
    </div>
  );
}
