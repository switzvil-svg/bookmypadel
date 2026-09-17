import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/cookies";

// Coarse, edge-level gate: redirects unauthenticated visitors before the page
// even renders. This only checks that a session cookie is present — it can't
// verify the token or role without a D1 round trip, so each protected page
// still does its own full session + role check server-side (defense in
// depth, same pattern as /admin's existing isAdmin() guard).
const PLAYER_ROUTES = ["/compte"];
const ORGANIZER_ROUTES = ["/organisateurs/tableau-de-bord", "/organisateurs/nouveau-stage"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  if (hasSession) return NextResponse.next();

  const isPlayerRoute = PLAYER_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  const isOrganizerRoute = ORGANIZER_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  if (isPlayerRoute) {
    const loginUrl = new URL("/connexion", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (isOrganizerRoute) {
    const loginUrl = new URL("/organisateurs/connexion", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/compte/:path*", "/organisateurs/tableau-de-bord/:path*", "/organisateurs/nouveau-stage/:path*"],
};
