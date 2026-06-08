import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    vehicleId: String,
    vehicleName: String,
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    status: String,
    priority: String,
    createdAt: String,
  },
  {
    timestamps: true,
    collection: "enquiries",
  }
);

export const Enquiry =
  mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
