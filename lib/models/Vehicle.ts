import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    make: String,
    model: String,
    year: Number,
    vin: String,
    licensePlate: String,
    status: String,
    price: Number,
    mileage: Number,
    color: String,
    fuelType: String,
    transmission: String,
    imageUrl: String,
  },
  {
    timestamps: true,
    collection: "vehicles",
  }
);

export const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);
