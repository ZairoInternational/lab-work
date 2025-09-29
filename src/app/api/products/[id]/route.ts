import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Product from "../../../../models/product";
import mongoose from "mongoose";
import "../../../../models/category";


export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    connectDB();
    const { id } = await params;
    console.log(id);
    const product = await Product.findById(id).populate("category");
    console.log("expecting product",product);
    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}



export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const {id} = await params;
    const data = await req.json();
    const updated = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
