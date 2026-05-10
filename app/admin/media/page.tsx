"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategoriesManager from "@/components/admin/CategoriesManager";

type AdminVideo = {
  slug: string;
  name: string;
  kind: "embed" | "file";
  thumbnail: string;
  categorySlug: string;
  order: number;
  provider?: string;
};

type Category = { slug: string; name: string; order: number };

export default function AdminMediaPage() {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [vRes, cRes] = await Promise.all([
      fetch("/api/admin/videos"),
      fetch("/api/admin/video-categories"),
    ]);
    setVideos(await vRes.json());
    setCategories(await cRes.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const grouped = new Map<string, AdminVideo[]>();
  for (const v of videos) {
    const list = grouped.get(v.categorySlug) ?? [];
    list.push(v);
    grouped.set(v.categorySlug, list);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }

  const orphanSlugs = [...grouped.keys()].filter(
    (s) => !categories.find((c) => c.slug === s)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media videos</h1>
          <p className="text-gray-500 mt-1">
            Manage the videos shown on the public Media page.
          </p>
        </div>
        <Link
          href="/admin/media/new"
          className="bg-[#2A9D8F] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#1A7A6E] text-sm"
        >
          Add video
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : (
            <>
              {categories.map((cat) => {
                const inCat = grouped.get(cat.slug) ?? [];
                return (
                  <section
                    key={cat.slug}
                    className="bg-white rounded-xl shadow-sm border border-gray-200"
                  >
                    <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="font-semibold text-gray-900">{cat.name}</h2>
                      <span className="text-xs text-gray-400">
                        {inCat.length} video{inCat.length === 1 ? "" : "s"}
                      </span>
                    </header>
                    {inCat.length === 0 ? (
                      <p className="px-6 py-4 text-sm text-gray-400">
                        No videos in this category.
                      </p>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {inCat.map((v) => (
                          <li key={v.slug}>
                            <Link
                              href={`/admin/media/${v.slug}`}
                              className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50"
                            >
                              <span className="w-7 text-xs text-gray-400 tabular-nums">
                                {v.order}
                              </span>
                              {v.thumbnail ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={v.thumbnail}
                                  alt=""
                                  className="w-20 h-12 object-cover rounded bg-gray-100 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-20 h-12 bg-gray-100 rounded flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {v.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {v.kind === "embed"
                                    ? `${v.provider ?? "embed"} link`
                                    : "Direct upload"}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}

              {orphanSlugs.length > 0 && (
                <section className="bg-white rounded-xl shadow-sm border border-amber-200">
                  <header className="px-6 py-4 border-b border-amber-100">
                    <h2 className="font-semibold text-amber-700">
                      Uncategorized
                    </h2>
                    <p className="text-xs text-amber-600 mt-0.5">
                      These videos belong to a category that no longer exists.
                      Reassign them by editing.
                    </p>
                  </header>
                  <ul className="divide-y divide-gray-100">
                    {orphanSlugs.flatMap((s) =>
                      (grouped.get(s) ?? []).map((v) => (
                        <li key={v.slug}>
                          <Link
                            href={`/admin/media/${v.slug}`}
                            className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50"
                          >
                            <div className="w-20 h-12 bg-gray-100 rounded flex-shrink-0" />
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {v.name}
                            </p>
                            <span className="text-xs text-gray-500 ml-auto">
                              category: {v.categorySlug}
                            </span>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <CategoriesManager />
        </div>
      </div>
    </div>
  );
}
