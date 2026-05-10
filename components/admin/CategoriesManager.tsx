"use client";

import { useEffect, useState } from "react";

type Category = { slug: string; name: string; order: number };

export default function CategoriesManager() {
  const [cats, setCats] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/video-categories");
    const data: Category[] = await res.json();
    setCats(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function add() {
    if (!newName.trim()) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/video-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to add");
    } else {
      setNewName("");
      await load();
    }
    setBusy(false);
  }

  async function rename(slug: string, name: string) {
    await fetch(`/api/admin/video-categories/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    await load();
  }

  async function setOrder(slug: string, order: number) {
    await fetch(`/api/admin/video-categories/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });
    await load();
  }

  async function remove(slug: string) {
    if (!confirm("Delete this category? It must have zero videos first.")) return;
    const res = await fetch(`/api/admin/video-categories/${slug}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to delete");
    } else {
      await load();
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Categories</h3>
      <p className="text-sm text-gray-500 mb-4">
        Sub-sections shown on the public Media page, in this order.
      </p>

      <ul className="divide-y divide-gray-100">
        {cats.map((c) => (
          <li key={c.slug} className="py-2 flex items-center gap-2">
            <input
              type="number"
              value={c.order}
              onChange={(e) => setOrder(c.slug, Number(e.target.value) || 0)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <input
              type="text"
              defaultValue={c.name}
              onBlur={(e) => {
                if (e.target.value !== c.name) rename(c.slug, e.target.value);
              }}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              type="button"
              onClick={() => remove(c.slug)}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
        />
        <button
          type="button"
          onClick={add}
          disabled={busy || !newName.trim()}
          className="px-4 py-2 bg-[#2A9D8F] text-white rounded-lg text-sm font-medium hover:bg-[#1A7A6E] disabled:opacity-50"
        >
          Add
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
