import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/db";
import Certificate from "@/src/models/certificate";

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
  const items = await Certificate.find().sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json({
    success: true,
    data: items.map((c) => ({
      _id: String(c._id),
      name: c.name,
      image: c.image,
      order: c.order ?? 0,
    })),
  });
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  if (!name || !image) {
    return NextResponse.json({ success: false, message: "Name and image URL are required" }, { status: 400 });
  }

  await connectDB();
  const count = await Certificate.countDocuments();
  const doc = await Certificate.create({ name, image, order: count });

  return NextResponse.json({
    success: true,
    data: { _id: String(doc._id), name: doc.name, image: doc.image, order: doc.order },
  });
}
