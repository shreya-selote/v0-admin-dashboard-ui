import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Vehicle } from "@/lib/models/Vehicle";

export const dynamic = "force-dynamic";

function serialize(doc: any) {
  const { _id, __v, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, unknown> = {};
    for (const key of [
      "make",
      "model",
      "year",
      "vin",
      "licensePlate",
      "status",
      "price",
      "mileage",
      "color",
      "fuelType",
      "transmission",
      "imageUrl",
    ]) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    await connectDB();
    const updated = await Vehicle.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json(serialize(updated));
  } catch (error) {
    console.error("[v0] PUT /api/vehicles/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const deleted = await Vehicle.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[v0] DELETE /api/vehicles/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}
