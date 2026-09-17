import { NextResponse } from "next/server";
import { listLeadsByOrganizer } from "@/lib/db";
import { enrichLead, DEMO_ORGANIZER_ID } from "@/lib/leads";

export const dynamic = "force-dynamic";

export async function GET() {
  const raw = await listLeadsByOrganizer(DEMO_ORGANIZER_ID);
  const leads = await Promise.all(raw.map(enrichLead));
  return NextResponse.json({ leads });
}
