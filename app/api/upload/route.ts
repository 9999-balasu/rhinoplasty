

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper function to save base64 image
function saveBase64Image(base64String: string, filename: string): string {
  const matches = base64String.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)/);
  if (matches?.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  const imageBuffer = Buffer.from(matches[2], "base64");

  // Use a single 'processed-image.jpg' filename to avoid double prefix
  const filePath = path.resolve("public", filename);
  fs.writeFileSync(filePath, imageBuffer);

  return `/processed-${filename}`;
}

// Function to process the image (for now, just saving it)
async function processImage(imageBase64: string, intensity: number): Promise<string> {
  // Use the correct filename for the processed image
  const filename = `processed-image.jpg`; // Corrected filename
  return saveBase64Image(imageBase64, filename);
}

// Handle the POST request
export async function POST(req: Request) {
  try {
    const { image, intensity } = await req.json(); // Get image and intensity from request body
    
    // Check if the image and intensity are provided
    if (!image || intensity === undefined) {
      return NextResponse.json({ error: "Missing image or intensity" }, { status: 400 });
    }

    // Process the image and get the processed image URL
    const processedImageUrl = await processImage(image, intensity);

    return NextResponse.json({ url: processedImageUrl }); // Send the processed image URL
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json({ error: "Error processing the image" }, { status: 500 });
  }
}
