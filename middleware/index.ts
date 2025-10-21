import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Authentication Middleware
 * Protects routes by checking for valid session before allowing access
 * 
 * Execution Flow:
 * 1. Runs before any matching route is processed
 * 2. Checks for valid session cookie
 * 3. Redirects to login if no session found
 * 4. Allows access if session exists
 * 
 * When it runs:
 * - Executes on every route that matches the matcher pattern
 * - Runs on both client and server-side navigation
 * - Processes before the actual route handler
 * 
 * @param request - Incoming request object from Next.js
 * @returns NextResponse with either redirect or continuation
 */
export async function middleware(request: NextRequest) {
  // Extract session cookie using better-auth helper
  const sessionCookie = getSessionCookie(request);

  // If no valid session found, redirect to sign-in page
  // This prevents unauthorized access to protected routes
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow request to proceed if session exists
  return NextResponse.next();
}

/**
 * Middleware Configuration
 * Defines which routes should be protected
 * 
 * Matcher Pattern Explanation:
 * - Excludes: /api/* (API routes)
 * - Excludes: /_next/* (Next.js internal routes)
 * - Excludes: /sign-in, /sign-up (Auth pages)
 * - Excludes: /assets (Static assets)
 * - Protects: All other routes
 * 
 * Examples of Protected Routes:
 * - / (Home page)
 * - /watchlist (Watchlist page)
 * - /search (Search page)
 * - Any other app routes
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
  ],
};