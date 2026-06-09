import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Image } from "@/lib/models/Image";
import { serializeImage } from "../images/route";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

// Accepts a multipart form upload (field name `file`) along with a `listing_id`.
// Because no external blob store is configured, the file is encoded as a data
// URL and stored on the existing `images` collection. We do not alter the
// schema: data is written into the standard `image_url` field.
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    // JSON fallback: allow passing an existing URL directly.
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const image_url = body.image_url ?? body.url;
      const listing_id = body.listing_id;
      if (!image_url || !listing_id) {
        return NextResponse.json(
          { error: "listing_id and image_url are required" },
          { status: 400 }
        );
      }
      await connectDB();
      const created = await Image.create({
        image_id: body.image_id ?? `IMG${Date.now()}`,
        listing_id,
        image_url,
        is_thumbnail: Boolean(body.is_thumbnail),
      });
      return NextResponse.json(serializeImage(created.toObject()), {
        status: 201,
      });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const listing_id = formData.get("listing_id");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A file is required" },
        { status: 400 }
      );
    }
    if (!listing_id || typeof listing_id !== "string") {
      return NextResponse.json(
        { error: "A listing_id is required" },
        { status: 400 }
      );
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File exceeds the 5MB size limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

    await connectDB();
    const created = await Image.create({
      image_id: `IMG${Date.now()}`,
      listing_id,
      image_url: dataUrl,
      is_thumbnail: formData.get("is_thumbnail") === "true",
    });

    return NextResponse.json(serializeImage(created.toObject()), {
      status: 201,
    });
  } catch (error) {
    console.error("[v0] POST /api/uploads failed:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
