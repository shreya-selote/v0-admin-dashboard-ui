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

// Derive a human-readable stock status from the quantity on hand.
function statusForQuantity(quantity: number) {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= 3) return "Low Stock";
  return "In Stock";
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, delta, quantity } = body ?? {};

    if (!id) {
      return NextResponse.json(
        { error: "An inventory id is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const item = await Inventory.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    // Support both an absolute quantity and a relative delta (+1 / -1).
    const nextQuantity =
      typeof quantity === "number"
        ? quantity
        : Math.max(0, (item.quantity ?? 0) + (delta ?? 0));

    item.quantity = nextQuantity;
    item.status = statusForQuantity(nextQuantity);
    item.lastUpdated = new Date().toISOString();
    await item.save();

    return NextResponse.json(serialize(item.toObject()));
  } catch (error) {
    console.error("[v0] PATCH /api/inventory failed:", error);
    return NextResponse.json(
      { error: "Failed to update inventory item" },
      { status: 500 }
    );
  }
}
