import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Product from "../../../../models/product";
import "../../../../models/category";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const { slug } = await params;
    console.log("slug param:", slug);

    const product = await Product.findOne({ slug }).populate("category");

    console.log("expecting product", product);

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
