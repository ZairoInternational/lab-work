import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export function middleware(req:NextRequest){
    const {pathname}=req.nextUrl
    
    if(pathname.startsWith("/admin") && pathname !== "/admin/login"){
        const cookie=req.cookies.get("admin_auth");
        if(!cookie || cookie.value !== "ok"){
            const url=req.nextUrl.clone();
            url.pathname="/admin/login";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config={
    matcher:["/admin/:path*"],
}