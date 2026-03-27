"use client";

import { useState } from "react";
import type { Country } from "@/lib/countries";
import CountryCard from "@/components/CountryCard";

const regions = [
  { key: "all", label: "All" },
  { key: "europe", label: "Europe" },
  { key: "americas", label: "Americas" },
  { key: "africa", label: "Africa" },
  { key: "asia", label: "Asia" },
  { key: "middle-east", label: "Middle East" },
] as const;

export default function CountryFilter({ countries }: { countries: Country[] }) {
  const [activeRegion, setActiveRegion] = useState<string>("all");

  const filtered =
    activeRegion === "all"
      ? countries
      : countries.filter((c) => c.region === activeRegion);

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {regions.map((region) => (
          <button
            key={region.key}
            onClick={() => setActiveRegion(region.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeRegion === region.key
                ? "bg-primary text-white"
                : "bg-light text-secondary hover:bg-primary/10"
            }`}
          >
            {region.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((country) => (
          <CountryCard key={country.slug} country={country} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted py-12">
          No countries found in this region.
        </p>
      )}
    </div>
  );
}
