import mongoose, { Schema, Model } from "mongoose";

export interface InventoryDoc {
  vehicleId: string;
  vehicleName: string;
  quantity: number;
  location: string;
  lastUpdated: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const InventorySchema = new Schema<InventoryDoc>(
  {
    vehicleId: { type: String, default: "" },
    vehicleName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    location: { type: String, required: true },
    lastUpdated: { type: String, default: "" },
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  { timestamps: true, collection: "inventory" }
);

export const Inventory: Model<InventoryDoc> =
  mongoose.models.Inventory ||
  mongoose.model<InventoryDoc>("Inventory", InventorySchema);
