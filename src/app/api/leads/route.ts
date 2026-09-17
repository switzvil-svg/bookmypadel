import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { createLead } from "@/lib/db";
import { getStageBySlug } from "@/data/stages";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as any;
  const stageId = typeof body?.stageId === "string" ? body.stageId : "";
  const stage = getStageBySlug(stageId);
  if (!stage) {
    return NextResponse.json({ error: "Stage introuvable." }, { status: 404 });
  }

  const lead = await createLead({
    userId: user.id,
    stageId: stage.id,
    organizerId: stage.coach.id,
    redirectUrl: stage.coach.externalUrl,
  });

  return NextResponse.json({
    redirectUrl: lead.redirect_url,
    trackingPath: `/go/${stage.id}/${user.id}/${lead.token}`,
  });
}
