import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export const dynamic = "force-dynamic";

// Convert a Mongo document into the plain shape the UI expects (string `id`).
function serialize(doc: any) {
  const { _id, __v, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(users.map(serialize));
  } catch (error) {
    console.error("[v0] GET /api/users failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const created = await User.create(body);
    return NextResponse.json(serialize(created.toObject()), { status: 201 });
  } catch (error) {
    console.error("[v0] POST /api/users failed:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
