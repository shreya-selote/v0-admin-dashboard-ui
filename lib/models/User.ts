import mongoose from "mongoose";

// Matches the real `users` collection (marketplace accounts). strict:false so we
// never drop unexpected fields when reading/writing existing documents.
const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    userType: String,
    phone: String,
    city: String,
    state: String,
    isVerified: Boolean,
  },
  {
    timestamps: true,
    collection: "users",
    strict: false,
  }
);

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);
