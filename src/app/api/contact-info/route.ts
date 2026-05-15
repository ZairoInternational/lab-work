import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import ContactInfo from "@/src/models/contactInfo";

type ContactInfoLean = {
  address?: string;
  phone1?: string;
  phone2?: string;
};

export async function GET() {
  await connectDB();

  const doc = (await ContactInfo.findOne().sort({ updatedAt: -1 }).lean()) as ContactInfoLean | null;

  return NextResponse.json({
    address: doc?.address ?? "128 Near Golden Mall London Eye",
    phone1: doc?.phone1 ?? "+91 9956499800",
    phone2: doc?.phone2 ?? "+91 9807850733",
  });
}

