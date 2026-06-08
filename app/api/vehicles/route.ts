import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Vehicle } from "@/lib/models/Vehicle";

function serialize(doc: any) {
  const { _id, __v, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export async function GET() {
  try {
    await connectDB();
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(vehicles.map(serialize));
  } catch (error) {
    console.error("[v0] GET /api/vehicles failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const created = await Vehicle.create(body);
    return NextResponse.json(serialize(created.toObject()), { status: 201 });
  } catch (error) {
    console.error("[v0] POST /api/vehicles failed:", error);
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
