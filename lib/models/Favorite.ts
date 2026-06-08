import mongoose from "mongoose";

// Matches the existing `favorites` collection shape in the database.
const FavoriteSchema = new mongoose.Schema(
  {
    favorite_id: String,
    user_id: String,
    listing_id: String,
    created_at: { type: Date, default: Date.now },
  },
  {
    collection: "favorites",
    strict: false,
  }
);

export const Favorite =
  mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);
