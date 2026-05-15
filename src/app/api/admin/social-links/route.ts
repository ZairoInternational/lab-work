import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/db";
import SocialLinks from "@/src/models/socialLinks";

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

const KEYS = ["facebook", "instagram", "twitter", "linkedin", "youtube", "github"] as const;

type SocialLinksLean = Partial<Record<(typeof KEYS)[number], string>>;

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  await connectDB();
  const doc = (await SocialLinks.findOne().sort({ updatedAt: -1 }).lean()) as SocialLinksLean | null;
  const data = Object.fromEntries(
    KEYS.map((k) => [k, String(doc?.[k] ?? "").trim()])
  ) as Record<(typeof KEYS)[number], string>;

  return NextResponse.json({ success: true, data });
}

export async function PUT(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  const body = await req.json().catch(() => ({}));
  const payload: Record<string, string> = {};
  for (const key of KEYS) {
    const v = body[key];
    payload[key] = typeof v === "string" ? v.trim() : "";
  }

  await connectDB();
  const doc = await SocialLinks.findOne().sort({ updatedAt: -1 });
  if (doc) {
    for (const key of KEYS) {
      (doc as Record<string, string>)[key] = payload[key] ?? "";
    }
    await doc.save();
  } else {
    await SocialLinks.create(payload);
  }

  return NextResponse.json({ success: true });
}
