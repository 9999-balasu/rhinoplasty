"use client";
import { useState } from "react";

export default function ImageDisplay() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Upload failed!");
      return;
    }

    const data = await res.json();
    setImageUrl(data.url); // Store uploaded image URL
  };

  return (
    <div className="p-4 border rounded-lg">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {imageUrl && (
        <div className="mt-4">
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" className="w-64 h-auto rounded-lg border" />
        </div>
      )}
    </div>
  );
}
