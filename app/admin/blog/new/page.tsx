"use client";

import { useRouter } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import Link from "next/link";

export default function NewBlogPostPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSave(data: any): Promise<boolean> {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/admin/blog");
        return true;
      }
      return false;
    } catch {
      return false;
    }
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
          New Blog Post
        </h1>
      </div>
      <BlogForm isNew onSave={handleSave} />
    </div>
  );
}
