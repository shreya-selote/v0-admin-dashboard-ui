import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Vehicle } from "@/lib/models/Vehicle";
import { Enquiry } from "@/lib/models/Enquiry";
import { Inventory } from "@/lib/models/Inventory";

export const dynamic = "force-dynamic";

// Aggregate dashboard analytics from the existing collections. Read-only; this
// endpoint never writes or changes any schema.
export async function GET() {
  try {
    await connectDB();

    const [users, vehicles, enquiries, inventory] = await Promise.all([
      User.find({}).lean(),
      Vehicle.find({}).lean(),
      Enquiry.find({}).lean(),
      Inventory.find({}).lean(),
    ]);

    const activeUsers = users.filter((u: any) => u.isVerified).length;
    const totalVehicles = vehicles.length;
    const lowStockItems = inventory.filter(
      (i: any) => i.status !== "In Stock"
    ).length;
    const pendingEnquiries = enquiries.filter(
      (e: any) => e.status === "New" || e.status === "In Progress"
    ).length;

    const vehicleStatus = {
      Available: vehicles.filter((v: any) => v.status === "Available").length,
      Sold: vehicles.filter((v: any) => v.status === "Sold").length,
      Pending: vehicles.filter((v: any) => v.status === "Pending").length,
    };

    const enquiryStatus = {
      New: enquiries.filter((e: any) => e.status === "New").length,
      "In Progress": enquiries.filter((e: any) => e.status === "In Progress")
        .length,
      Resolved: enquiries.filter((e: any) => e.status === "Resolved").length,
      Closed: enquiries.filter((e: any) => e.status === "Closed").length,
    };

    const inventoryByLocation = inventory.map((i: any) => ({
      vehicleName: i.vehicleName,
      location: i.location,
      quantity: i.quantity ?? 0,
      status: i.status,
    }));

    return NextResponse.json({
      totals: {
        users: users.length,
        activeUsers,
        vehicles: totalVehicles,
        enquiries: enquiries.length,
        pendingEnquiries,
        inventoryItems: inventory.length,
        lowStockItems,
      },
      vehicleStatus,
      enquiryStatus,
      inventoryByLocation,
    });
  } catch (error) {
    console.error("[v0] GET /api/analytics failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
