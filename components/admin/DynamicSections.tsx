"use client";

import FormField from "./FormField";

interface Section {
  title: string;
  content?: string;
  bullets?: string[];
}

interface DynamicSectionsProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export default function DynamicSections({ sections, onChange }: DynamicSectionsProps) {
  function updateSection(index: number, field: keyof Section, value: string) {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function addSection() {
    onChange([...sections, { title: "", content: "", bullets: [] }]);
  }

  function removeSection(index: number) {
    onChange(sections.filter((_, i) => i !== index));
  }

  function moveSection(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const updated = [...sections];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  }

  function updateBullet(sectionIndex: number, bulletIndex: number, value: string) {
    const updated = [...sections];
    const bullets = [...(updated[sectionIndex].bullets || [])];
    bullets[bulletIndex] = value;
    updated[sectionIndex] = { ...updated[sectionIndex], bullets };
    onChange(updated);
  }

  function addBullet(sectionIndex: number) {
    const updated = [...sections];
    const bullets = [...(updated[sectionIndex].bullets || []), ""];
    updated[sectionIndex] = { ...updated[sectionIndex], bullets };
    onChange(updated);
  }

  function removeBullet(sectionIndex: number, bulletIndex: number) {
    const updated = [...sections];
    const bullets = (updated[sectionIndex].bullets || []).filter((_, i) => i !== bulletIndex);
    updated[sectionIndex] = { ...updated[sectionIndex], bullets };
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600">
              Section {i + 1}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveSection(i, "up")}
                disabled={i === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveSection(i, "down")}
                disabled={i === sections.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeSection(i)}
                className="p-1 text-red-400 hover:text-red-600 ml-2"
                title="Remove section"
              >
                ✕
              </button>
            </div>
          </div>

          <FormField
            label="Title"
            value={section.title}
            onChange={(v) => updateSection(i, "title", v)}
            required
          />
          <FormField
            label="Content"
            type="textarea"
            value={section.content || ""}
            onChange={(v) => updateSection(i, "content", v)}
            rows={3}
          />

          {/* Bullets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bullet Points
            </label>
            <div className="space-y-2">
              {(section.bullets || []).map((bullet, bi) => (
                <div key={bi} className="flex gap-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => updateBullet(i, bi, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none"
                    placeholder={`Bullet ${bi + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeBullet(i, bi)}
                    className="px-2 text-red-400 hover:text-red-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addBullet(i)}
                className="text-sm text-[#2A9D8F] hover:text-[#1A7A6E] font-medium"
              >
                + Add Bullet
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSection}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:border-[#2A9D8F] hover:text-[#2A9D8F] transition-colors"
      >
        + Add Section
      </button>
    </div>
  );
}
