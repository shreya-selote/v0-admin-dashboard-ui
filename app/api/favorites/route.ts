import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Favorite } from "@/lib/models/Favorite";

export const dynamic = "force-dynamic";

function serialize(doc: any) {
  const { _id, __v, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export async function GET() {
  try {
    await connectDB();
    const favorites = await Favorite.find({}).sort({ created_at: -1 }).lean();
    return NextResponse.json(favorites.map(serialize));
  } catch (error) {
    console.error("[v0] GET /api/favorites failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const created = await Favorite.create({
      favorite_id: body.favorite_id,
      user_id: body.user_id,
      listing_id: body.listing_id,
      created_at: body.created_at ? new Date(body.created_at) : new Date(),
    });
    return NextResponse.json(serialize(created.toObject()), { status: 201 });
  } catch (error) {
    console.error("[v0] POST /api/favorites failed:", error);
    return NextResponse.json(
      { error: "Failed to create favorite" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    // Also accept the id in the JSON body as a fallback.
    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body?.id ?? null;
    }

    if (!id) {
      return NextResponse.json(
        { error: "A favorite id is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const deleted = await Favorite.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("[v0] DELETE /api/favorites failed:", error);
    return NextResponse.json(
      { error: "Failed to delete favorite" },
      { status: 500 }
    );
  }
}
