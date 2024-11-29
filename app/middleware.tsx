import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check if the current URL is `/` (root)
  if (request.nextUrl.pathname === "/") {
    // Redirect to `/signup/register`
    return NextResponse.redirect(new URL("/auth/register", request.url));
  }
}
