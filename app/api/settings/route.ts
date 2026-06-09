import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Setting } from "@/lib/models/Setting";

export const dynamic = "force-dynamic";

const TOGGLE_KEYS = [
  "emailNotifications",
  "pushNotifications",
  "twoFactorAuth",
  "dataBackup",
  "apiAccess",
  "performanceMode",
] as const;

function serialize(doc: any) {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

// Always return the single settings document, creating defaults if absent.
async function getOrCreateSettings() {
  let settings = await Setting.findOne({}).lean();
  if (!settings) {
    const created = await Setting.create({});
    settings = created.toObject();
  }
  return settings;
}

export async function GET() {
  try {
    await connectDB();
    const settings = await getOrCreateSettings();
    return NextResponse.json(serialize(settings));
  } catch (error) {
    console.error("[v0] GET /api/settings failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Only persist known boolean toggle keys.
    const update: Record<string, boolean> = {};
    for (const key of TOGGLE_KEYS) {
      if (typeof body?.[key] === "boolean") {
        update[key] = body[key];
      }
    }

    await connectDB();
    const existing = await Setting.findOne({});
    const updated = existing
      ? await Setting.findByIdAndUpdate(existing._id, update, {
          new: true,
        }).lean()
      : (await Setting.create(update)).toObject();

    return NextResponse.json(serialize(updated));
  } catch (error) {
    console.error("[v0] PUT /api/settings failed:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
