"use client";

import { useRef, useState } from "react";

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const MAX_BYTES = 500 * 1024 * 1024;
const ALLOWED = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];

async function uploadVideo(
  file: File,
  onProgress: (percent: number) => void
): Promise<string> {
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      kind: "video",
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to get upload URL");
  }
  const { uploadUrl, publicUrl } = (await res.json()) as {
    uploadUrl: string;
    publicUrl: string;
  };

  // Use XHR so we can stream upload progress.
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });

  return publicUrl;
}

export default function VideoUpload({
  value,
  onChange,
  label = "Video file",
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!ALLOWED.includes(file.type)) {
      setError("Use mp4, webm, or mov.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File must be under 500 MB.");
      return;
    }
    setError("");
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadVideo(file, setProgress);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer border-gray-300 hover:border-gray-400 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {uploading ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Uploading… {progress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#2A9D8F] h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              Click to upload a video file
            </p>
            <p className="text-xs text-gray-400 mt-1">mp4, webm, mov — max 500 MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      <div className="mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste a hosted video URL (mp4)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none"
        />
      </div>
      {value && (
        <video
          key={value}
          src={value}
          controls
          className="mt-3 w-full max-w-md rounded-lg border border-gray-200 bg-black"
        />
      )}
    </div>
  );
}
