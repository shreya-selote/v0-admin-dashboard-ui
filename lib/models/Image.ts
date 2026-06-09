import mongoose from "mongoose";

// Matches the real `images` collection shape.
const ImageSchema = new mongoose.Schema(
  {
    image_id: String,
    listing_id: String,
    image_url: String,
    is_thumbnail: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "images",
    strict: false,
  }
);

export const Image =
  mongoose.models.Image || mongoose.model("Image", ImageSchema);
