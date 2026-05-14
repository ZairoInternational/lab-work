import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import SiteClient from "@/src/models/siteClient";

export async function GET() {
  try {
    await connectDB();
    const items = await SiteClient.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({
      data: items.map((c) => ({
        _id: String(c._id),
        name: c.name,
        logo: c.logo,
        order: c.order ?? 0,
      })),
    });
  } catch {
    return NextResponse.json({ data: [], error: "Failed to load clients" }, { status: 500 });
  }
}
