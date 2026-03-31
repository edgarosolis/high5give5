"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Toast from "@/components/admin/Toast";

interface Country {
  name: string;
  slug: string;
  projectType: string;
  childrenFed: number;
  region: string;
  partner?: string;
  sections?: unknown[];
}

export default function CountryListPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/admin/countries")
      .then((r) => r.json())
      .then((data) => {
        setCountries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(slug: string) {
    try {
      const res = await fetch(`/api/admin/countries/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setCountries(countries.filter((c) => c.slug !== slug));
        setToast({ message: "Country deleted", type: "success" });
      } else {
        setToast({ message: "Failed to delete", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
    setDeleteSlug(null);
  }

  const filtered = countries.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = !regionFilter || c.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
          <p className="text-gray-500 mt-1">{countries.length} country profiles</p>
        </div>
        <Link
          href="/admin/countries/new"
          className="bg-[#2A9D8F] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#1A7A6E] transition-colors text-sm"
        >
          + Add Country
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search countries..."
          className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none"
        />
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none"
        >
          <option value="">All Regions</option>
          <option value="europe">Europe</option>
          <option value="americas">Americas</option>
          <option value="africa">Africa</option>
          <option value="asia">Asia</option>
          <option value="middle-east">Middle East</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Region</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Project Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Children Fed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Partner</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Content</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((country) => (
                <tr key={country.slug} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{country.name}</td>
                  <td className="py-3 px-4 text-gray-600 capitalize">{country.region.replace("-", " ")}</td>
                  <td className="py-3 px-4 text-gray-600">{country.projectType}</td>
                  <td className="py-3 px-4 text-gray-600">{country.childrenFed}</td>
                  <td className="py-3 px-4 text-gray-600">{country.partner || "—"}</td>
                  <td className="py-3 px-4 text-center">
                    {country.sections && country.sections.length > 0 ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-300">✗</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      href={`/admin/countries/${country.slug}`}
                      className="text-[#2A9D8F] hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteSlug(country.slug)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No countries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteSlug && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Country</h3>
            <p className="text-gray-600 mb-6">
              Delete <strong>{countries.find((c) => c.slug === deleteSlug)?.name}</strong>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteSlug(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteSlug)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
