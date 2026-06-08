import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { AdminProfile } from "@/lib/models/AdminProfile";

export const dynamic = "force-dynamic";

function serialize(doc: any) {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

// Always return a single admin profile, creating a default one if none exists.
async function getOrCreateProfile() {
  let profile = await AdminProfile.findOne({}).lean();
  if (!profile) {
    const created = await AdminProfile.create({});
    profile = created.toObject();
  }
  return profile;
}

export async function GET() {
  try {
    await connectDB();
    const profile = await getOrCreateProfile();
    return NextResponse.json(serialize(profile));
  } catch (error) {
    console.error("[v0] GET /api/admin/profile failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body ?? {};

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const existing = await AdminProfile.findOne({});
    const updated = existing
      ? await AdminProfile.findByIdAndUpdate(
          existing._id,
          { name, email, phone: phone ?? "" },
          { new: true }
        ).lean()
      : (await AdminProfile.create({ name, email, phone: phone ?? "" })).toObject();

    return NextResponse.json(serialize(updated));
  } catch (error) {
    console.error("[v0] PUT /api/admin/profile failed:", error);
    return NextResponse.json(
      { error: "Failed to update admin profile" },
      { status: 500 }
    );
  }
}
