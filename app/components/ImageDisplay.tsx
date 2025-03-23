

"use client";
import { useState } from "react";
import Image from 'next/image';
export default function ImageDisplay() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(0);

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
    setImageUrl(data.url);
    setProcessedUrl(null);
  };

  const applyEffect = async (value: number) => {
    setIntensity(value);
    if (!imageUrl) return;

    const res = await fetch(`/api/process?image=${encodeURIComponent(imageUrl)}&intensity=${value}`);
    if (!res.ok) {
      alert("Processing failed!");
      return;
    }

    const data = await res.json();
    
    if (data.url) {
      setProcessedUrl(data.url);
    } else {
      alert("AI processing failed. Try a different image.");
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <input type="file" accept="image/*" onChange={handleUpload} />

      {imageUrl && (
        <div className="mt-4">
          <p>Original Image:</p>
          <img src={imageUrl} alt="Uploaded" className="w-64 h-auto rounded-lg border" />
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <p>Adjust Effect:</p>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={intensity}
            onChange={(e) => applyEffect(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {processedUrl && (
        <div className="mt-4">
          <p>Processed Image (AI-enhanced Rhinoplasty):</p>
          <Image 
  src={processedUrl} 
  alt="Processed" 
  className="w-64 h-auto rounded-lg border" 
  width={256} // Specify width
   
/>

        
        </div>
      )}
    </div>
  );
}

