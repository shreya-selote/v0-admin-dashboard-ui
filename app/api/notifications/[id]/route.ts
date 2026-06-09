import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/lib/models/Notification";
import { serializeNotification } from "../route";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, unknown> = {};
    for (const key of ["type", "title", "message", "read", "actionUrl"]) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    await connectDB();
    const updated = await Notification.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(serializeNotification(updated));
  } catch (error) {
    console.error("[v0] PATCH /api/notifications/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
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
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[v0] DELETE /api/notifications/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
