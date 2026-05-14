import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import SocialLinks from "@/src/models/socialLinks";

export async function GET() {
  await connectDB();
  const doc = await SocialLinks.findOne().sort({ updatedAt: -1 }).lean();
  return NextResponse.json({
    facebook: doc?.facebook ?? "",
    instagram: doc?.instagram ?? "",
    twitter: doc?.twitter ?? "",
    linkedin: doc?.linkedin ?? "",
    youtube: doc?.youtube ?? "",
    github: doc?.github ?? "",
  });
}
