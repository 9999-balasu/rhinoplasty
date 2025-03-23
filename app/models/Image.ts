import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  originalUrl: String,
  processedUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);

