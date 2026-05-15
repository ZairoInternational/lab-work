import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/db";
import ContactInfo from "@/src/models/contactInfo";

type ContactInfoLean = {
  address?: string;
  phone1?: string;
  phone2?: string;
};

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
  const doc = (await ContactInfo.findOne().sort({ updatedAt: -1 }).lean()) as ContactInfoLean | null;
  return NextResponse.json({
    success: true,
    data: {
      address: doc?.address ?? "",
      phone1: doc?.phone1 ?? "",
      phone2: doc?.phone2 ?? "",
    },
  });
}

export async function PUT(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  const body = await req.json().catch(() => ({}));
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const phone1 = typeof body.phone1 === "string" ? body.phone1.trim() : "";
  const phone2 = typeof body.phone2 === "string" ? body.phone2.trim() : "";

  await connectDB();
  const doc = await ContactInfo.findOne().sort({ updatedAt: -1 });
  if (doc) {
    doc.address = address;
    doc.phone1 = phone1;
    doc.phone2 = phone2;
    await doc.save();
  } else {
    await ContactInfo.create({ address, phone1, phone2 });
  }

  return NextResponse.json({ success: true });
}

