import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { serializeUser } from "../route";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, unknown> = {};
    for (const key of [
      "firstName",
      "lastName",
      "email",
      "userType",
      "phone",
      "city",
      "state",
      "isVerified",
    ]) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    await connectDB();
    const updated = await User.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(serializeUser(updated));
  } catch (error) {
    console.error("[v0] PUT /api/users/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[v0] DELETE /api/users/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
