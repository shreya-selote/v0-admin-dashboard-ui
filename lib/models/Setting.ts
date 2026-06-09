import mongoose from "mongoose";

// New `app_settings` collection (does not touch any existing schema). Stores a
// single document of admin dashboard preference toggles.
const SettingSchema = new mongoose.Schema(
  {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    twoFactorAuth: { type: Boolean, default: true },
    dataBackup: { type: Boolean, default: true },
    apiAccess: { type: Boolean, default: true },
    performanceMode: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "app_settings",
  }
);

export const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
