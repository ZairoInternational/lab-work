import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  await connectDB();
  const items = await Achievement.find().sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json({
    success: true,
    data: items.map((a) => ({
      _id: String(a._id),
      title: a.title,
      description: a.description,
      photo: a.photo,
      order: a.order ?? 0,
    })),
  });
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const photo = typeof body.photo === "string" ? body.photo.trim() : "";

  if (!title || !description || !photo) {
    return NextResponse.json(
      { success: false, message: "Title, description, and photo are required" },
      { status: 400 }
    );
  }

  await connectDB();
  const count = await Achievement.countDocuments();
  const doc = await Achievement.create({ title, description, photo, order: count });

  return NextResponse.json({
    success: true,
    data: {
      _id: String(doc._id),
      title: doc.title,
      description: doc.description,
      photo: doc.photo,
      order: doc.order,
    },
  });
}
