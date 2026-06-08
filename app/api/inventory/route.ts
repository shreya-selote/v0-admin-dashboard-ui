import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Inventory } from "@/lib/models/Inventory";

export const dynamic = "force-dynamic";

// Convert a Mongo document into the plain shape the UI expects (string `id`).
function serialize(doc: any) {
  const { _id, __v, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export async function GET() {
  try {
    await connectDB();
    const inventory = await Inventory.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(inventory.map(serialize));
  } catch (error) {
    console.error("[v0] GET /api/inventory failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const created = await Inventory.create(body);
    return NextResponse.json(serialize(created.toObject()), { status: 201 });
  } catch (error) {
    console.error("[v0] POST /api/inventory failed:", error);
    return NextResponse.json(
      { error: "Failed to create inventory item" },
      { status: 500 }
    );
  }
}
