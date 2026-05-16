import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import ContactInfo from "@/src/models/contactInfo";
import { withContactDefaults, type SiteContactInfo } from "@/src/lib/site-contact";

type ContactInfoLean = Partial<SiteContactInfo>;

export async function GET() {
  await connectDB();

  const doc = (await ContactInfo.findOne().sort({ updatedAt: -1 }).lean()) as ContactInfoLean | null;

  return NextResponse.json(withContactDefaults(doc));
}
