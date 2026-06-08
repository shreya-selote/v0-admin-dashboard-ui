import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    role: String,
    status: String,
    joinDate: String,
    avatar: String,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);