/**
 * Database seed script for the "autohub" database.
 *
 * Usage (the dev environment already has MONGODB_URI set):
 *   node scripts/seed.mjs
 *
 * It connects using process.env.MONGODB_URI, clears the target collections,
 * and inserts a few dummy records into each so the dashboard has data to show.
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("[v0] Missing MONGODB_URI environment variable.");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    role: String,
    status: String,
    joinDate: String,
    avatar: String,
  },
  { timestamps: true, collection: "users" }
);

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
  { timestamps: true, collection: "vehicles" }
);

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
  { timestamps: true, collection: "enquiries" }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);
const Enquiry =
  mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);

const users = [
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Manager",
    status: "Active",
    joinDate: "2024-02-20",
  },
  {
    name: "Mike Davis",
    email: "mike@example.com",
    role: "User",
    status: "Active",
    joinDate: "2024-03-10",
  },
];

const vehicles = [
  {
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    vin: "5YJ3E1EA2PF123456",
    licensePlate: "TESLA001",
    status: "Available",
    price: 45000,
    mileage: 1200,
    color: "Pearl White",
    fuelType: "Electric",
    transmission: "Automatic",
  },
  {
    make: "BMW",
    model: "3 Series",
    year: 2023,
    vin: "WBADO5C5XGE987654",
    licensePlate: "BMW001",
    status: "Sold",
    price: 48000,
    mileage: 8500,
    color: "Black",
    fuelType: "Diesel",
    transmission: "Automatic",
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2023,
    vin: "JHMFC6F19LM234567",
    licensePlate: "HONDA001",
    status: "Available",
    price: 28000,
    mileage: 5300,
    color: "Silver",
    fuelType: "Petrol",
    transmission: "Automatic",
  },
];

const enquiries = [
  {
    vehicleName: "Tesla Model 3",
    customerName: "David Lee",
    customerEmail: "david.lee@example.com",
    customerPhone: "+1-555-0101",
    status: "New",
    priority: "High",
    createdAt: "2024-06-07",
  },
  {
    vehicleName: "Honda Civic",
    customerName: "Robert Martinez",
    customerEmail: "robert.m@example.com",
    customerPhone: "+1-555-0103",
    status: "Resolved",
    priority: "Medium",
    createdAt: "2024-06-05",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("[v0] Connected to:", mongoose.connection.name);

    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Enquiry.deleteMany({});

    const insertedUsers = await User.insertMany(users);
    const insertedVehicles = await Vehicle.insertMany(vehicles);

    // Link enquiries to the inserted vehicles where possible.
    enquiries[0].vehicleId = insertedVehicles[0]?._id?.toString();
    enquiries[1].vehicleId = insertedVehicles[2]?._id?.toString();
    const insertedEnquiries = await Enquiry.insertMany(enquiries);

    console.log(`[v0] Inserted ${insertedUsers.length} users`);
    console.log(`[v0] Inserted ${insertedVehicles.length} vehicles`);
    console.log(`[v0] Inserted ${insertedEnquiries.length} enquiries`);
    console.log("[v0] Seed complete.");
  } catch (error) {
    console.error("[v0] Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
