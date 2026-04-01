"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import Link from "next/link";

export default function EditBlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [initialData, setInitialData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/blog/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setInitialData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSave(data: any): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (!initialData) {
    return <div className="text-gray-500">Blog post not found.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/blog"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to Blog Posts
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          Edit: {initialData.title as string}
        </h1>
      </div>
      <BlogForm initialData={initialData} onSave={handleSave} />
    </div>
  );
}
