import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  // Protect only /admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
      return NextResponse.next(); // allow request
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

// Only run middleware for /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
