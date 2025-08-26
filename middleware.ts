import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  // console.log('middleware')
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // matcher: [
  //   "/((?!_next|favicon.ico|assets|login|join|lost-pass|blog|support|docs|knowledge|platform|privacy|terms|$).*)", // Exclude these paths
  // ],
  matcher: ["/account/:path*"],
};