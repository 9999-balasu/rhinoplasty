


/*import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const imageBuffer = Buffer.from(matches[2], "base64");
    const filename = `processed-${uuidv4()}.jpg`;
    const filePath = path.join(process.cwd(), "public", filename);

    fs.writeFileSync(filePath, imageBuffer);

    return NextResponse.json({ url: `/${filename}` });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
*/




import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate base64 format and extract the image type
    const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const imageType = matches[1]; // jpg, png, etc.
    const imageBase64 = matches[2];

    // Upload to Cloudinary with the correct MIME type
    const result = await cloudinary.uploader.upload(
      `data:image/${imageType};base64,${imageBase64}`,
      {
        public_id: `processed-${uuidv4()}`,
        resource_type: "image",
        folder: "uploads", // Optional: Stores images in the "uploads" folder in Cloudinary
        // upload_preset: "your_upload_preset", // Uncomment if using an unsigned upload preset
      }
    );

    return NextResponse.json({ url: result.secure_url });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
