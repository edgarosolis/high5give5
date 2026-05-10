"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import VideoForm, { VideoData } from "@/components/admin/VideoForm";

export default function NewVideoPage() {
  const router = useRouter();

  async function handleSave(data: VideoData) {
    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, kind: data.kind }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err.error };
    }
    const { slug } = (await res.json()) as { slug: string };
    setTimeout(() => router.push(`/admin/media/${slug}`), 600);
    return { ok: true };
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/media"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to videos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Add video</h1>
      </div>
      <VideoForm isNew onSave={handleSave} />
    </div>
  );
}
