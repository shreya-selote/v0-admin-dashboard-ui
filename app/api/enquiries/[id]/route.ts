import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Enquiry } from "@/lib/models/Enquiry";

export const dynamic = "force-dynamic";

function serialize(doc: any) {
  const { _id, __v, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, unknown> = {};
    for (const key of [
      "vehicleName",
      "customerName",
      "customerEmail",
      "customerPhone",
      "status",
      "priority",
    ]) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    await connectDB();
    const updated = await Enquiry.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json(serialize(updated));
  } catch (error) {
    console.error("[v0] PATCH /api/enquiries/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update enquiry" },
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
    const deleted = await Enquiry.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[v0] DELETE /api/enquiries/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
