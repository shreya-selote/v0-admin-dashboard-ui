import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    vehicleId: String,
    vehicleName: String,
    quantity: Number,
    location: String,
    lastUpdated: String,
    status: String,
  },
  {
    timestamps: true,
    collection: "inventory",
  }
);

export const Inventory =
  mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);
