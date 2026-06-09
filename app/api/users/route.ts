import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { createNotification } from "@/lib/notify";

export const dynamic = "force-dynamic";

// Convert a real `users` document into the shape the dashboard UI expects.
// Never expose the password hash.
export function serializeUser(doc: any) {
  const { _id, __v, password, firstName, lastName, userType, isVerified, createdAt, ...rest } =
    doc;
  const name =
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    rest.name ||
    rest.email ||
    "Unknown";
  const role = userType
    ? userType.charAt(0).toUpperCase() + userType.slice(1)
    : rest.role || "User";
  return {
    id: _id.toString(),
    firstName,
    lastName,
    name,
    userType,
    role,
    isVerified: Boolean(isVerified),
    status: isVerified ? "Active" : "Inactive",
    joinDate: createdAt
      ? new Date(createdAt).toISOString()
      : new Date().toISOString(),
    ...rest,
  };
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(users.map(serializeUser));
  } catch (error) {
    console.error("[v0] GET /api/users failed:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email } = body ?? {};

    if (!firstName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "First name and email are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const created = await User.create({
      firstName: firstName.trim(),
      lastName: lastName?.trim() ?? "",
      email: email.trim(),
      userType: body.userType ?? "buyer",
      phone: body.phone ?? "",
      city: body.city ?? "",
      state: body.state ?? "",
      isVerified: body.isVerified ?? false,
    });

    const serialized = serializeUser(created.toObject());
    await createNotification({
      type: "Success",
      title: "New user added",
      message: `${serialized.name} (${serialized.email}) was added as a ${serialized.role}.`,
      actionUrl: "/dashboard/users",
    });

    return NextResponse.json(serialized, { status: 201 });
  } catch (error) {
    console.error("[v0] POST /api/users failed:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
