import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import Achievement from "@/src/models/achievement";

export async function GET() {
  try {
    await connectDB();
    const items = await Achievement.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(
      items.map((a) => ({
        _id: String(a._id),
        title: a.title,
        description: a.description,
        photo: a.photo,
        order: a.order ?? 0,
        createdAt: a.createdAt,
      }))
    );
  } catch {
    return NextResponse.json({ error: "Failed to load achievements" }, { status: 500 });
  }
}
