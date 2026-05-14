import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import SiteReview from "@/src/models/siteReview";

export async function GET() {
  try {
    await connectDB();
    const items = await SiteReview.find()
      .sort({ order: 1, createdAt: -1 })
      .limit(24)
      .lean();

    return NextResponse.json({
      data: items.map((r) => ({
        id: String(r._id),
        name: r.name,
        rating: r.rating,
        photo: r.photo,
        body: r.body,
      })),
    });
  } catch {
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
