import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Product from "../../../../models/product";
import "../../../../models/category";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const trimmedSlug =slug.trim();
    // console.log("slug param:", slug);

    const product = await Product.findOne({ slug:trimmedSlug }).populate("category");

    // console.log("expecting product", product);

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product,{
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}