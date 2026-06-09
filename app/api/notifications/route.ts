import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/lib/models/Notification";

export const dynamic = "force-dynamic";

export function serializeNotification(doc: any) {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return {
    id: _id.toString(),
    createdAt: createdAt
      ? new Date(createdAt).toISOString()
      : new Date().toISOString(),
    ...rest,
  };
}

export async function GET() {
  try {
    await connectDB();
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(notifications.map(serializeNotification));
  } catch (error) {
    console.error("[v0] GET /api/notifications failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message } = body ?? {};

    if (!title?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const created = await Notification.create({
      type: body.type ?? "Info",
      title: title.trim(),
      message: message.trim(),
      read: Boolean(body.read),
      actionUrl: body.actionUrl,
    });
    return NextResponse.json(serializeNotification(created.toObject()), {
      status: 201,
    });
  } catch (error) {
    console.error("[v0] POST /api/notifications failed:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
