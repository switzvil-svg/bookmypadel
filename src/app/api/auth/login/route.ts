import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createSession } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { SESSION_COOKIE } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as any;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const genericError = NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  if (!email || !password) return genericError;

  const user = await findUserByEmail(email);
  if (!user || !user.password_hash) return genericError;

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return genericError;

  const token = await createSession(user.id);

  const res = NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
