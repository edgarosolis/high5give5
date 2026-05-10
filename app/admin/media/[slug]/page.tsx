"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import VideoForm, { VideoData } from "@/components/admin/VideoForm";

type LoadedVideo = Partial<VideoData> & { slug?: string };

export default function EditVideoPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const router = useRouter();
  const [video, setVideo] = useState<LoadedVideo | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/videos/${slug}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((v: LoadedVideo) => setVideo(v))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [slug]);

  async function handleSave(data: VideoData) {
    const res = await fetch(`/api/admin/videos/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err.error };
    }
    return { ok: true };
  }

  async function handleDelete() {
    const res = await fetch(`/api/admin/videos/${slug}`, { method: "DELETE" });
    if (!res.ok) return false;
    router.push("/admin/media");
    return true;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }
  if (!video) {
    return <p className="text-sm text-gray-500">Loading…</p>;
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
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{video.name}</h1>
      </div>
      <VideoForm
        initial={video}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
