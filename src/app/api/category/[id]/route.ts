import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Category from "../../../../models/category";

type Params = {
  params: {
    id: string;
  };
};


export async function PUT(req: Request, { params }: Params) {
  await connectDB();
  const body = await req.json();

  const updated = await Category.findByIdAndUpdate(params.id, body, { new: true });

  if (!updated) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Category.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
