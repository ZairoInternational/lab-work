import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Product from "../../../../models/product";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug: params.slug }).populate("category");
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  await connectDB();
  const data = await req.json();

  const updated = await Product.findOneAndUpdate(
    { slug: params.slug }, 
    data,
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// Delete product by slug
export async function DELETE(_: Request, { params }: { params: { slug: string } }) {
  await connectDB();
  const deleted = await Product.findOneAndDelete({ slug: params.slug });

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}