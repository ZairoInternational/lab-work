import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      
      const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

