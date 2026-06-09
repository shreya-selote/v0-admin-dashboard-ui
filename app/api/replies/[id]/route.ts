import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { EnquiryReply } from "@/lib/models/EnquiryReply";
import { serializeReply } from "../route";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, unknown> = {};
    if (body.reply_text !== undefined || body.message !== undefined) {
      update.reply_text = body.reply_text ?? body.message;
    }
    if (body.sender_id !== undefined || body.repliedBy !== undefined) {
      update.sender_id = body.sender_id ?? body.repliedBy;
    }
    if (body.enquiry_id !== undefined || body.enquiryId !== undefined) {
      update.enquiry_id = body.enquiry_id ?? body.enquiryId;
    }

    await connectDB();
    const updated = await EnquiryReply.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }
    return NextResponse.json(serializeReply(updated));
  } catch (error) {
    console.error("[v0] PATCH /api/replies/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update reply" },
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
    const deleted = await EnquiryReply.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[v0] DELETE /api/replies/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete reply" },
      { status: 500 }
    );
  }
}
