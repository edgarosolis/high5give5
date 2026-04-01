"use client";

import { useState, useRef, useCallback } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
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

      onChange(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onChange]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
          onChange={handleInputChange}
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
              Drop an image here or <span className="text-[#2A9D8F] font-medium">click to browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF, SVG — max 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}

      {/* Manual URL input */}
      <div className="mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or enter image URL manually"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none"
        />
      </div>

      {/* Preview */}
      {value && (
        <div className="mt-3">
          <img
            src={value}
            alt="Preview"
            className="w-48 h-32 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}
