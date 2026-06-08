import mongoose from "mongoose";

const AdminProfileSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Alex Johnson" },
    email: { type: String, default: "alex@example.com" },
    phone: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "admin_profile",
  }
);

export const AdminProfile =
  mongoose.models.AdminProfile ||
  mongoose.model("AdminProfile", AdminProfileSchema);
