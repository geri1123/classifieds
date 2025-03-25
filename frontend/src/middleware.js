import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to pages inside /MyPortal
export const config = {
  matcher: ["/MyPortal/:path*"], // Protects all routes inside MyPortal
};
