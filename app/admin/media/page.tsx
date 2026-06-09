"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminVideo = {
  slug: string;
  name: string;
  kind: "embed" | "file";
  thumbnail: string;
  categorySlug?: string;
  section?: "stories" | "founders" | "children";
  countrySlug?: string;
  order: number;
  provider?: string;
};

type CountryOption = { slug: string; name: string; archived?: boolean };

function inferSection(
  categorySlug?: string
): "stories" | "founders" | "children" {
  const s = (categorySlug || "").toLowerCase();
  if (s.includes("child")) return "children";
  if (s.includes("found") || s.includes("tribut")) return "founders";
  return "stories";
}

function resolve(v: AdminVideo) {
  const section = v.section ?? inferSection(v.categorySlug);
  let countrySlug = v.countrySlug ?? "";
  if (
    section === "stories" &&
    !countrySlug &&
    v.categorySlug &&
    v.categorySlug !== "more-stories"
  ) {
    countrySlug = v.categorySlug;
  }
  return { section, countrySlug };
}

function byOrder(a: AdminVideo, b: AdminVideo) {
  return a.order - b.order || a.name.localeCompare(b.name);
}

export default function AdminMediaPage() {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/videos").then((r) => r.json()),
      fetch("/api/admin/countries").then((r) => r.json()),
    ])
      .then(([v, c]) => {
        setVideos(v);
        setCountries(c);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const countryName = (slug: string) =>
    countries.find((c) => c.slug === slug)?.name ||
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const stories = videos.filter((v) => resolve(v).section === "stories");
  const founders = videos
    .filter((v) => resolve(v).section === "founders")
    .sort(byOrder);
  const children = videos
    .filter((v) => resolve(v).section === "children")
    .sort(byOrder);

  // Stories grouped by country (empty slug => "More Stories").
  const byCountry = new Map<string, AdminVideo[]>();
  for (const v of stories) {
    const key = resolve(v).countrySlug;
    const list = byCountry.get(key) ?? [];
    list.push(v);
    byCountry.set(key, list);
  }
  const storyCountries = [...byCountry.entries()]
    .map(([slug, vids]) => ({
      slug,
      name: slug ? countryName(slug) : "More Stories (unassigned)",
      videos: vids.sort(byOrder),
    }))
    .sort((a, b) => {
      if (!a.slug) return 1;
      if (!b.slug) return -1;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media videos</h1>
          <p className="text-gray-500 mt-1">
            Three sections: Stories (by country), Founders &amp; Tributes, and
            Children&apos;s Voices.
          </p>
        </div>
        <Link
          href="/admin/media/new"
          className="bg-[#2A9D8F] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#1A7A6E] text-sm"
        >
          Add video
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : (
        <div className="space-y-8 max-w-3xl">
          {/* ── Stories ── */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200">
            <header className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Stories</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Grouped by country. Set a video&apos;s country when editing it.
              </p>
            </header>
            <div className="divide-y divide-gray-100">
              {storyCountries.length === 0 && (
                <p className="px-6 py-4 text-sm text-gray-400">No stories yet.</p>
              )}
              {storyCountries.map((c) => (
                <div key={c.slug || "more-stories"} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`text-sm font-semibold ${
                        c.slug ? "text-gray-800" : "text-amber-700"
                      }`}
                    >
                      {c.name}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {c.videos.length} video{c.videos.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <VideoList videos={c.videos} />
                </div>
              ))}
            </div>
          </section>

          {/* ── Founders & Tributes ── */}
          <SectionBlock title="Founders & Tributes" videos={founders} />

          {/* ── Children's Voices ── */}
          <SectionBlock title="Children's Voices" videos={children} />
        </div>
      )}
    </div>
  );
}

function SectionBlock({
  title,
  videos,
}: {
  title: string;
  videos: AdminVideo[];
}) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200">
      <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-400">
          {videos.length} video{videos.length === 1 ? "" : "s"}
        </span>
      </header>
      <div className="px-6 py-4">
        {videos.length === 0 ? (
          <p className="text-sm text-gray-400">No videos in this section.</p>
        ) : (
          <VideoList videos={videos} />
        )}
      </div>
    </section>
  );
}

function VideoList({ videos }: { videos: AdminVideo[] }) {
  return (
    <ul className="divide-y divide-gray-100">
      {videos.map((v) => (
        <li key={v.slug}>
          <Link
            href={`/admin/media/${v.slug}`}
            className="py-2.5 flex items-center gap-4 hover:bg-gray-50 rounded"
          >
            <span className="w-7 text-xs text-gray-400 tabular-nums text-center">
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
  );
}
