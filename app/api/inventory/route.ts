import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Inventory } from "@/lib/models/Inventory";

function serialize(doc: any) {
  const { _id, __v, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export async function GET() {
  try {
    await connectDB();
    const items = await Inventory.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(items.map(serialize));
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
