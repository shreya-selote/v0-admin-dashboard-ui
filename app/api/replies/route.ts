import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { EnquiryReply } from "@/lib/models/EnquiryReply";

export const dynamic = "force-dynamic";

// Map the real `enquiry_replies` document to UI-friendly aliases without
// altering the stored schema.
export function serializeReply(doc: any) {
  const { _id, __v, enquiry_id, sender_id, reply_text, timestamp, ...rest } =
    doc;
  return {
    id: _id.toString(),
    enquiry_id,
    sender_id,
    reply_text,
    timestamp: timestamp ? new Date(timestamp).toISOString() : undefined,
    // UI-friendly aliases.
    enquiryId: enquiry_id,
    repliedBy: sender_id,
    message: reply_text,
    ...rest,
  };
}

export async function GET() {
  try {
    await connectDB();
    const replies = await EnquiryReply.find({}).sort({ timestamp: -1 }).lean();
    return NextResponse.json(replies.map(serializeReply));
  } catch (error) {
    console.error("[v0] GET /api/replies failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const enquiry_id = body.enquiry_id ?? body.enquiryId;
    const sender_id = body.sender_id ?? body.repliedBy;
    const reply_text = body.reply_text ?? body.message;

    if (!enquiry_id || !reply_text?.trim()) {
      return NextResponse.json(
        { error: "enquiry_id and reply_text are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const created = await EnquiryReply.create({
      reply_id: body.reply_id ?? `R${Date.now()}`,
      enquiry_id,
      sender_id: sender_id ?? "Admin",
      reply_text: reply_text.trim(),
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
    });
    return NextResponse.json(serializeReply(created.toObject()), {
      status: 201,
    });
  } catch (error) {
    console.error("[v0] POST /api/replies failed:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
