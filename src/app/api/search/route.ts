import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import Category from "@/src/models/category";
import Product from "@/src/models/product";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const qRaw = (searchParams.get("q") ?? "").trim();

  if (!qRaw) {
    return NextResponse.json({ categories: [], products: [] });
  }

  const q = qRaw.slice(0, 80);
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const [categories, products] = await Promise.all([
    Category.find({ name: rx }).select("name slug").limit(8).lean(),
    Product.find({ name: rx })
      .populate("category", "name slug")
      .select("name slug category")
      .limit(8)
      .lean(),
  ]);

  return NextResponse.json({
    categories: categories.map((c) => ({ name: c.name, slug: c.slug })),
    products: products
      .map((p: any) => ({
        name: p.name,
        slug: p.slug,
        category: p.category?.slug ? { name: p.category.name, slug: p.category.slug } : null,
      }))
      .filter((p: any) => p.category),
  });
}

