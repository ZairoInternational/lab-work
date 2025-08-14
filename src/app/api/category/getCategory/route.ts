import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Category from "../../../../models/category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /category error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
