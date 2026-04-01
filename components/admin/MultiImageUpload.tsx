"use client";

import { useState, useRef, useCallback } from "react";

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export default function MultiImageUpload({
  values,
  onChange,
  label = "Images",
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File must be under 10MB.");
        return;
      }

      setError("");
      setUploading(true);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);

        setProgress(30);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        setProgress(80);

        if (!res.ok) {
          let errMsg = "Upload failed";
          try {
            const data = await res.json();
            errMsg = data.error || errMsg;
          } catch { /* empty response */ }
          throw new Error(errMsg);
        }

        const { publicUrl } = await res.json();
        setProgress(100);
        onChange([...values, publicUrl]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onChange, values]
  );

  async function handleFiles(files: FileList) {
    for (const file of Array.from(files)) {
      await handleFile(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }

  function removeImage(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const newValues = [...values];
    const target = index + direction;
    if (target < 0 || target >= newValues.length) return;
    [newValues[index], newValues[target]] = [newValues[target], newValues[index]];
    onChange(newValues);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Image grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {values.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                  (e.target as HTMLImageElement).className =
                    "w-full h-32 bg-gray-100 rounded-lg border border-gray-200";
                }}
              />
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, -1)}
                    className="w-6 h-6 bg-white/90 rounded text-xs hover:bg-white shadow"
                  >
                    ←
                  </button>
                )}
                {i < values.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, 1)}
                    className="w-6 h-6 bg-white/90 rounded text-xs hover:bg-white shadow"
                  >
                    →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="w-6 h-6 bg-red-500/90 text-white rounded text-xs hover:bg-red-600 shadow"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-[#2A9D8F] bg-[#2A9D8F]/5"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Uploading...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#2A9D8F] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div>
            <svg
              className="w-8 h-8 mx-auto text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            <p className="text-sm text-gray-600">
              Drop images here or{" "}
              <span className="text-[#2A9D8F] font-medium">click to browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPEG, PNG, WebP, GIF — max 10MB each. Multiple files supported.
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
