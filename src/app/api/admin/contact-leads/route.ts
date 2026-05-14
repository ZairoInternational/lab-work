import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/db";
import ContactLead from "@/src/models/contactLead";

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
  const items = await ContactLead.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    success: true,
    data: items.map((l) => ({
      _id: String(l._id),
      name: l.name,
      phone: l.phone,
      email: l.email,
      companyName: l.companyName,
      productName: l.productName,
      note: l.note ?? "",
      read: Boolean(l.read),
      createdAt: l.createdAt,
    })),
  });
}
