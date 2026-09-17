import { NextRequest, NextResponse } from "next/server";
import { createUser, createSession, findUserByEmail, UserRole } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { SESSION_COOKIE } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as any;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const role: UserRole = body?.role === "organizer" ? "organizer" : "player";

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Nom invalide." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caractères." },
      { status: 400 }
    );
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email. Connectez-vous plutôt." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(name, email, passwordHash, role);
    const token = await createSession(user.id);

    const res = NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error("[api/auth/signup] failed for role=%s email=%s:", role, email, err);
    return NextResponse.json({ error: "Erreur serveur, réessayez dans un instant." }, { status: 500 });
  }
}
