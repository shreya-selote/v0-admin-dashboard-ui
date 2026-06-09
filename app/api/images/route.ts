import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Image } from "@/lib/models/Image";

export const dynamic = "force-dynamic";

// Map a real `images` document to the shape the UI expects. We never change the
// stored schema; instead we expose convenient aliases (`url`) alongside the
// real fields (`image_url`, `listing_id`, `is_thumbnail`).
export function serializeImage(doc: any) {
  const { _id, __v, image_url, createdAt, ...rest } = doc;
  return {
    id: _id.toString(),
    image_url,
    url: image_url,
    createdAt: createdAt ? new Date(createdAt).toISOString() : undefined,
    ...rest,
  };
}

export async function GET() {
  try {
    await connectDB();
    const images = await Image.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(images.map(serializeImage));
  } catch (error) {
    console.error("[v0] GET /api/images failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
  } catch (error) {
    console.error("[v0] POST /api/images failed:", error);
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 }
    );
  }
}
