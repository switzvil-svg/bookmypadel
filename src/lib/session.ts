import { cookies } from "next/headers";
import { getUserBySessionToken, type DbUser } from "@/lib/db";
import { SESSION_COOKIE, ADMIN_COOKIE } from "@/lib/cookies";

export { SESSION_COOKIE, ADMIN_COOKIE };

export async function getSessionUser(): Promise<DbUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return (await getUserBySessionToken(token)) ?? null;
  } catch (err) {
    // Called from the root layout on every page — a DB hiccup here must
    // degrade to "logged out", never take down the entire site.
    console.error("[lib/session] getSessionUser failed:", err);
    return null;
  }
}

export function isAdmin(): boolean {
  return cookies().get(ADMIN_COOKIE)?.value === "1";
}
