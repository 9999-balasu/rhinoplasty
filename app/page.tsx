

'use client'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// Define your class or constructor that will be used with `new`
class CanvasDrawer {
  private canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
    this.canvasRef = canvasRef;
  }

  draw(imageBase64: string) {
    const canvas = this.canvasRef.current;
    if (!canvas || !imageBase64) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageBase64;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Example of drawing arrows & circles (marking nose area)
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
      ctx.stroke();

      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 30, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 + 30, canvas.height / 2);
      ctx.stroke();
    };
  }
}

export default function Home() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"before" | "after" | "side-by-side">("before");
  const [loading, setLoading] = useState(false);
  const [intensity, setIntensity] = useState(50); // Default intensity
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleIntensityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntensity(Number(event.target.value));
  };

  const applyAIWithIntensity = async () => {
    if (!imageBase64) return alert("Upload an image first!");

    setLoading(true);

    const response = await fetch("/api/process-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageBase64, intensity }),
    });

    const data = await response.json();
    setLoading(false);

    if (data.url) {
      setProcessedImage(data.url);
      setViewMode("side-by-side");
    } else {
      alert("Error processing image.");
    }
  };

  const resetImage = () => {
    setImageBase64(null);
    setProcessedImage(null);
    setViewMode("before");
    setIntensity(50);
  };

  const saveImage = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "processed-image.png";
    link.click();
  };

  // Memoize drawOnCanvas to prevent unnecessary re-renders
  const drawOnCanvas = useCallback(() => {
    if (imageBase64 && canvasRef.current) {
      const drawer = new CanvasDrawer(canvasRef as React.RefObject<HTMLCanvasElement>);
      drawer.draw(imageBase64);
    }
  }, [imageBase64]);

  useEffect(() => {
    if (viewMode === "side-by-side") drawOnCanvas();
  }, [viewMode, drawOnCanvas]); // Add drawOnCanvas as a dependency

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold">AI Rhinoplasty Tool</h1>

      {/* File Upload */}
      <input type="file" accept="image/*" onChange={handleFileUpload} className="mt-4" />

      {/* Intensity Slider */}
      <div className="mt-4">
        <label className="text-gray-700">Adjust Intensity: {intensity}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={intensity}
          onChange={handleIntensityChange}
          className="mt-2"
        />
      </div>

      {/* Before/After Toggle Buttons */}
      <div className="flex gap-4 mt-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`px-4 py-2 rounded-md ${
            viewMode === "before" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"
          }`}
          onClick={() => setViewMode("before")}
        >
          Before
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`px-4 py-2 rounded-md ${
            viewMode === "after" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"
          }`}
          onClick={() => setViewMode("after")}
          disabled={!processedImage}
        >
          After
        </motion.button>

        {processedImage && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 rounded-md bg-purple-500 text-white"
            onClick={() => setViewMode("side-by-side")}
          >
            Side-by-Side
          </motion.button>
        )}
      </div>

      {/* Image Display */}
      {viewMode === "before" && imageBase64 && (
        <motion.img
          src={imageBase64}
          alt="Uploaded"
          className="w-64 h-auto rounded-lg shadow-lg mt-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {viewMode === "after" && processedImage && (
        <motion.img
          src={processedImage}
          alt="Processed"
          className="w-64 h-auto rounded-lg shadow-lg border-2 border-green-500 mt-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {viewMode === "side-by-side" && (
        <div className="flex gap-4 mt-4">
          <canvas ref={canvasRef} className="w-64 h-auto border border-gray-300 shadow-md" />

          {processedImage && (
            <img
              src={processedImage}
              alt="Processed"
              className="w-64 h-auto border-2 border-green-500 rounded-lg shadow-lg"
            />
          )}
        </div>
      )}

      {/* Apply AI Button */}
      <button onClick={applyAIWithIntensity} className="bg-blue-500 text-white px-4 py-2 mt-4">
        {loading ? "Processing..." : "Apply AI with Intensity"}
      </button>

      {/* Reset Button */}
      <button onClick={resetImage} className="bg-red-500 text-white px-4 py-2 mt-4">
        Reset
      </button>

      {/* Save Image Button */}
      <button onClick={saveImage} className="bg-green-500 text-white px-4 py-2 mt-4">
        Save Image
      </button>
    </div>
  );
}
