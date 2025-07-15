import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Define auth pages that authenticated users shouldn't access
  const authPages = ['/login', '/join', '/lost-pass'];
  
  // Define protected pages that require authentication
  const protectedPages = ['/account', '/membership','/explore',"/vehicles","/real-estate","/watches"];
  
  // Check if current path is an auth page
  const isAuthPage = authPages.some(page => pathname.startsWith(page));
  
  const isProtectedPage = protectedPages.some(page => pathname.startsWith(page));

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!_next|favicon.ico|assets|api|images|icons).*)",
  ],
};