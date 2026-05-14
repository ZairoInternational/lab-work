import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/db";
import SiteReview from "@/src/models/siteReview";

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
  if (!auth.ok) {
    return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  }

  await connectDB();
  const items = await SiteReview.find().sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({
    success: true,
    data: items.map((r) => ({
      _id: String(r._id),
      name: r.name,
      rating: r.rating,
      photo: r.photo,
      body: r.body,
      order: r.order ?? 0,
    })),
  });
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  }

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const photo = typeof body.photo === "string" ? body.photo.trim() : "";
  const reviewText = typeof body.body === "string" ? body.body.trim() : "";
  const rating = Number(body.rating);
  if (!name || !photo || !reviewText) {
    return NextResponse.json(
      { success: false, message: "Name, photo, and review text are required" },
      { status: 400 }
    );
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { success: false, message: "Rating must be a whole number from 1 to 5" },
      { status: 400 }
    );
  }

  await connectDB();
  const count = await SiteReview.countDocuments();
  const doc = await SiteReview.create({
    name,
    photo,
    body: reviewText,
    rating: Math.round(rating),
    order: count,
  });

  return NextResponse.json({
    success: true,
    data: {
      _id: String(doc._id),
      name: doc.name,
      rating: doc.rating,
      photo: doc.photo,
      body: doc.body,
      order: doc.order,
    },
  });
}
