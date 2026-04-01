"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Toast from "@/components/admin/Toast";

interface BlogPost {
  title: string;
  slug: string;
  countrySlug: string;
  countryName: string;
  publishedAt: string;
  images: string[];
  youtubeUrl?: string;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [countries, setCountries] = useState<{ slug: string; name: string }[]>(
    []
  );

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/blog").then((r) => r.json()),
      fetch("/api/admin/countries").then((r) => r.json()),
    ])
      .then(([blogData, countryData]) => {
        setPosts(blogData);
        setCountries(countryData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(slug: string) {
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPosts(posts.filter((p) => p.slug !== slug));
        setToast({ message: "Blog post deleted", type: "success" });
      } else {
        setToast({ message: "Failed to delete", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
    setDeleteSlug(null);
  }

  const filtered = posts.filter((p) => {
    const matchesSearch = p.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCountry =
      !countryFilter || p.countrySlug === countryFilter;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 mt-1">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-[#2A9D8F] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#1A7A6E] transition-colors text-sm"
        >
          + New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none"
        />
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
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
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Country
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Media
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr
                  key={post.slug}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {post.title}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {post.countryName}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">
                    {post.images?.length > 0 && (
                      <span title={`${post.images.length} image(s)`}>
                        🖼 {post.images.length}
                      </span>
                    )}
                    {post.youtubeUrl && (
                      <span className="ml-2" title="Has video">
                        ▶
                      </span>
                    )}
                    {(!post.images || post.images.length === 0) &&
                      !post.youtubeUrl && (
                        <span className="text-gray-300">—</span>
                      )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      href={`/admin/blog/${post.slug}`}
                      className="text-[#2A9D8F] hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteSlug(post.slug)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-500"
                  >
                    No blog posts found.
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Blog Post
            </h3>
            <p className="text-gray-600 mb-6">
              Delete{" "}
              <strong>
                {posts.find((p) => p.slug === deleteSlug)?.title}
              </strong>
              ? This cannot be undone.
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
