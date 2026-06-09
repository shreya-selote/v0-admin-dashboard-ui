import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    type: { type: String, default: "Info" },
    title: String,
    message: String,
    read: { type: Boolean, default: false },
    actionUrl: String,
  },
  {
    timestamps: true,
    collection: "notifications",
    strict: false,
  }
);

export const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
