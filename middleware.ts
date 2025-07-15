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
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|assets|.*\\.(svg|png|jpg|jpeg|ico|css|js|woff|woff2|ttf|eot|webp|gif)|login|join|lost-pass|explore|$).*)",
  ],
};