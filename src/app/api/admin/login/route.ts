import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as any;
  const code = typeof body?.code === "string" ? body.code : "";
  const expected = process.env.ADMIN_ACCESS_CODE || "changeme";

  if (code !== expected) {
    return NextResponse.json({ error: "Code incorrect." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
