import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import Certificate from "@/src/models/certificate";

export async function GET() {
  try {
    await connectDB();
    const items = await Certificate.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(
      items.map((c) => ({
        _id: String(c._id),
        name: c.name,
        image: c.image,
        order: c.order ?? 0,
      }))
    );
  } catch {
    return NextResponse.json({ error: "Failed to load certificates" }, { status: 500 });
  }
}
