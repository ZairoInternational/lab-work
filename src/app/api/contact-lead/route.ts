import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import ContactLead from "@/src/models/contactLead";
import { sendLeadEmail } from "@/src/lib/sendLeadEmail";

function basicEmailOk(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
    const productName = typeof body.productName === "string" ? body.productName.trim() : "";
    const note = typeof body.note === "string" ? body.note.trim() : "";

    if (!name || !phone || !email || !companyName || !productName) {
      return NextResponse.json(
        { success: false, message: "Name, phone, email, company name, and product name are required." },
        { status: 400 }
      );
    }
    if (!basicEmailOk(email)) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
    }

    await connectDB();
    const doc = await ContactLead.create({
      name,
      phone,
      email,
      companyName,
      productName,
      note,
    });

    const mail = await sendLeadEmail({ name, phone, email, companyName, productName, note });

    return NextResponse.json({
      success: true,
      id: String(doc._id),
      emailSent: mail.sent,
      ...(mail.sent ? {} : { emailWarning: mail.error || "Email not sent. Set MAIL_SENDER_EMAIL and MAIL_SENDER_APP_PASSWORD in .env.local." }),
    });
  } catch (e) {
    console.error("[contact-lead]", e);
    return NextResponse.json({ success: false, message: "Could not save your enquiry. Please try again later." }, { status: 500 });
  }
}
