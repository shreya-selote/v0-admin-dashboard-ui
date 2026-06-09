import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Favorite } from "@/lib/models/Favorite";

export const dynamic = "force-dynamic";

// The real `favorites` collection may use either {userId, carId, createdAt} or
// the legacy {user_id, listing_id, created_at}. Normalize to both so the UI can
// rely on `user_id`, `listing_id`, and `created_at` regardless of source shape.
function serialize(doc: any) {
  const { _id, __v, userId, carId, createdAt, ...rest } = doc;
  const user_id = rest.user_id ?? userId ?? "";
  const listing_id = rest.listing_id ?? carId ?? "";
  const created_at = rest.created_at ?? createdAt ?? null;
  return {
    id: _id.toString(),
    ...rest,
    user_id,
    listing_id,
    created_at: created_at
      ? new Date(created_at).toISOString()
      : null,
  };
}

export async function GET() {
  try {
    await connectDB();
    // Sort by either timestamp field; fall back gracefully when one is absent.
    const favorites = await Favorite.find({})
      .sort({ createdAt: -1, created_at: -1 })
      .lean();
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
