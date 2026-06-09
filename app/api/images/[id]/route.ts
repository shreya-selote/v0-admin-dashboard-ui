import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Image } from "@/lib/models/Image";
import { serializeImage } from "../route";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, unknown> = {};
    if (body.image_url !== undefined || body.url !== undefined) {
      update.image_url = body.image_url ?? body.url;
    }
    if (body.listing_id !== undefined) update.listing_id = body.listing_id;
    if (body.is_thumbnail !== undefined)
      update.is_thumbnail = Boolean(body.is_thumbnail);

    await connectDB();
    const updated = await Image.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json(serializeImage(updated));
  } catch (error) {
    console.error("[v0] PATCH /api/images/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
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
    const deleted = await Image.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[v0] DELETE /api/images/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
