import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/db";
import SiteClient from "@/src/models/siteClient";
import { DEFAULT_SITE_CLIENTS } from "@/src/data/default-site-clients";

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
  const items = await SiteClient.find().sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json({
    success: true,
    data: items.map((c) => ({
      _id: String(c._id),
      name: c.name,
      logo: c.logo,
      order: c.order ?? 0,
    })),
  });
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  const body = await req.json().catch(() => ({}));

  if (body.importDefaults === true) {
    await connectDB();
    let added = 0;
    for (const row of DEFAULT_SITE_CLIENTS) {
      const exists = await SiteClient.findOne({ logo: row.logo }).lean();
      if (exists) continue;
      const count = await SiteClient.countDocuments();
      await SiteClient.create({ name: row.name, logo: row.logo, order: count });
      added += 1;
    }
    return NextResponse.json({ success: true, data: { added } });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const logo = typeof body.logo === "string" ? body.logo.trim() : "";
  if (!name || !logo) {
    return NextResponse.json({ success: false, message: "Name and logo URL are required" }, { status: 400 });
  }

  await connectDB();
  const count = await SiteClient.countDocuments();
  const doc = await SiteClient.create({ name, logo, order: count });

  return NextResponse.json({
    success: true,
    data: { _id: String(doc._id), name: doc.name, logo: doc.logo, order: doc.order },
  });
}
