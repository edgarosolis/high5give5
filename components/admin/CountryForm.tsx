"use client";

import { useState } from "react";
import SectionCard from "./SectionCard";
import FormField from "./FormField";
import SaveButton from "./SaveButton";
import DynamicSections from "./DynamicSections";
import ImageUpload from "./ImageUpload";
import Toast from "./Toast";

interface CountrySection {
  title: string;
  content?: string;
  bullets?: string[];
}

interface CountryData {
  name: string;
  slug: string;
  projectType: string;
  description: string;
  intro: string;
  mealsPerFive: number;
  childrenFed: number;
  region: string;
  imageUrl: string;
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
    slug: initialData?.slug || "",
    projectType: initialData?.projectType || "",
    description: initialData?.description || "",
    intro: initialData?.intro || "",
    mealsPerFive: initialData?.mealsPerFive || 50,
    childrenFed: initialData?.childrenFed || 0,
    region: initialData?.region || "",
    imageUrl: initialData?.imageUrl || "",
    lat: initialData?.lat || 0,
    lng: initialData?.lng || 0,
    partner: initialData?.partner || "",
    sections: initialData?.sections || [],
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

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

      <SectionCard title="Basic Info">
        <FormField label="Name" value={data.name} onChange={handleNameChange} required />
        <FormField
          label="Slug"
          value={data.slug}
          onChange={(v) => setData({ ...data, slug: isNew ? slugify(v) : data.slug })}
          placeholder="auto-generated-from-name"
          required
        />
        <FormField label="Project Type" value={data.projectType} onChange={(v) => setData({ ...data, projectType: v })} required placeholder="e.g. Feeding, Water & Well, School Supplies" />
      </SectionCard>

      <SectionCard title="Description">
        <FormField label="Short Description" type="textarea" value={data.description} onChange={(v) => setData({ ...data, description: v })} required rows={3} placeholder="Shown on country cards in the grid" />
        <FormField label="Introduction" type="textarea" value={data.intro} onChange={(v) => setData({ ...data, intro: v })} rows={5} placeholder="Longer text shown at top of country detail page (optional)" />
      </SectionCard>

      <SectionCard title="Impact Stats">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Meals per $5" type="number" value={data.mealsPerFive} onChange={(v) => setData({ ...data, mealsPerFive: Number(v) })} required />
          <FormField label="Children Currently Fed" type="number" value={data.childrenFed} onChange={(v) => setData({ ...data, childrenFed: Number(v) })} required />
        </div>
      </SectionCard>

      <SectionCard title="Location & Image">
        <FormField label="Region" type="select" value={data.region} onChange={(v) => setData({ ...data, region: v })} required options={REGION_OPTIONS} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Latitude" type="number" value={data.lat} onChange={(v) => setData({ ...data, lat: Number(v) })} required />
          <FormField label="Longitude" type="number" value={data.lng} onChange={(v) => setData({ ...data, lng: Number(v) })} required />
        </div>
        <ImageUpload
          label="Country Image"
          value={data.imageUrl}
          onChange={(v) => setData({ ...data, imageUrl: v })}
        />
      </SectionCard>

      <SectionCard title="Partnership">
        <FormField label="Partner Organization" value={data.partner} onChange={(v) => setData({ ...data, partner: v })} placeholder="e.g. Ancora International (optional)" />
      </SectionCard>

      <SectionCard title="Rich Content Sections" description="Add detailed content sections for the country detail page.">
        <DynamicSections
          sections={data.sections}
          onChange={(sections) => setData({ ...data, sections })}
        />
      </SectionCard>

      <SaveButton loading={loading} onClick={handleSubmit} />
    </div>
  );
}
