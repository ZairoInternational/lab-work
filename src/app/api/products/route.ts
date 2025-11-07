import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Category from "../../../models/category";
import Product from "../../../models/product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) return NextResponse.json([]);
      const products = await Product.find({ category: category._id });
      return NextResponse.json(products);
    }

    const products = await Product.find()
  .populate("category", "name slug") // only fetch name + slug
  .limit(100);
    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/product  (create product)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, slug, categorySlug, price, images,pdf, shortDescription, description, specs, inStock } = body;
    // console.log("got the body",body);
    // Validate required fields
    if (!name || !slug || !categorySlug) {
      return NextResponse.json(
        { error: "name, slug, and categorySlug are required" },
        { status: 400 }
      );
    }

    // console.log("validated name slug category slug");

    // Find category by slug
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // console.log("found category");

    // Create product
    const product = await Product.create({
      name,
      slug,
      category: category._id,
      price,
      images,
      pdf,
      shortDescription,
      description,
      specs,
      inStock
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("POST /products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
