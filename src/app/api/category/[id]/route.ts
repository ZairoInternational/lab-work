import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Category from "../../../../models/category";

export async function PUT(req: Request, {params}: { params: Promise<{ id: string }>}) {
  await connectDB();
  const body = await req.json();

  const id = await params;

  const updated = await Category.findByIdAndUpdate(id.id, body, { new: true });

  if (!updated) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, {params}: { params: Promise<{ id: string }> }) {
  await connectDB();
  const id = await params;
  console.log(id)
  const deleted = await Category.findByIdAndDelete(id.id);

  if (!deleted) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
