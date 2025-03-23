


import { NextResponse } from "next/server";
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





  










