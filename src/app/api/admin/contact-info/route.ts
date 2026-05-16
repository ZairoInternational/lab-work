import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/db";
import ContactInfo from "@/src/models/contactInfo";
import { withContactDefaults, type SiteContactInfo } from "@/src/lib/site-contact";

type ContactInfoLean = Partial<SiteContactInfo>;

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

function pickFields(body: Record<string, unknown>): SiteContactInfo {
  const str = (key: keyof SiteContactInfo) =>
    typeof body[key] === "string" ? String(body[key]).trim() : "";

  return {
    address: str("address"),
    phone1: str("phone1"),
    phone2: str("phone2"),
    email1: str("email1"),
    email2: str("email2"),
    email3: str("email3"),
  };
}

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  await connectDB();
  const doc = (await ContactInfo.findOne().sort({ updatedAt: -1 }).lean()) as ContactInfoLean | null;
  return NextResponse.json({
    success: true,
    data: withContactDefaults(doc),
  });
}

export async function PUT(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  const body = await req.json().catch(() => ({}));
  const fields = pickFields(body as Record<string, unknown>);

  await connectDB();
  const doc = await ContactInfo.findOne().sort({ updatedAt: -1 });
  if (doc) {
    doc.address = fields.address;
    doc.phone1 = fields.phone1;
    doc.phone2 = fields.phone2;
    doc.email1 = fields.email1;
    doc.email2 = fields.email2;
    doc.email3 = fields.email3;
    await doc.save();
  } else {
    await ContactInfo.create(fields);
  }

  return NextResponse.json({ success: true });
}
