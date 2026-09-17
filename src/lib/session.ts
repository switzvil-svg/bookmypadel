import { cookies } from "next/headers";
import { getUserBySessionToken, type DbUser } from "@/lib/db";

export const SESSION_COOKIE = "bmp_session";
export const ADMIN_COOKIE = "bmp_admin";

export async function getSessionUser(): Promise<DbUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return (await getUserBySessionToken(token)) ?? null;
}

export function isAdmin(): boolean {
  return cookies().get(ADMIN_COOKIE)?.value === "1";
}
