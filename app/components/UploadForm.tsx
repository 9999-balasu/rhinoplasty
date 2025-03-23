/*"use client";

import { useState } from "react";

export default function UploadForm({ onUpload }: { onUpload: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      if (data.url) {
        onUpload(data.url);
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className={`bg-blue-500 text-white p-2 rounded ${loading ? "opacity-50" : ""}`}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}*/



import React from "react";

const UploadForm = ({ onUpload }: { onUpload: (image: string) => void }) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onUpload(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="mt-4 p-2"
    />
  );
};

export default UploadForm;
