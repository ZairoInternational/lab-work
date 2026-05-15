import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "@/src/lib/db";
import Achievement from "@/src/models/achievement";

function requireAdmin(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
  if (!token) return { ok: false as const, status: 401 as const, message: "Missing token" };
  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return { ok: true as const };
  } catch {
    return { ok: false as const, status: 401 as const, message: "Invalid token" };
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.title === "string") patch.title = body.title.trim();
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (typeof body.photo === "string") patch.photo = body.photo.trim();
  if (typeof body.order === "number" && Number.isFinite(body.order)) patch.order = body.order;

  await connectDB();
  const updated = await Achievement.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true });
  if (!updated) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
  }

  await connectDB();
  const deleted = await Achievement.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
