import { NextResponse } from "next/server";
import { listLeadsByOrganizer } from "@/lib/db";
import { enrichLead, DEMO_ORGANIZER_ID } from "@/lib/leads";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "organizer") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const raw = await listLeadsByOrganizer(DEMO_ORGANIZER_ID);
  const leads = await Promise.all(raw.map(enrichLead));
  return NextResponse.json({ leads });
}
