import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Product from "../../../../models/product";

// Get product by slug
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const slug = await params;
    const product = await Product.findOne({ slug: slug.slug }).populate("category");
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// Update product by slug
export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const slug = await params;
    const data = await req.json();

    const updated = await Product.findOneAndUpdate(
      { slug: slug.slug },
      data,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// Delete product by slug
export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const slug = await params;

    const deleted = await Product.findOneAndDelete({ slug: slug.slug });

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
