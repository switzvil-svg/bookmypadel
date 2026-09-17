import { NextRequest, NextResponse } from "next/server";
import { updateLeadStatus, getLeadById, LeadStatus } from "@/lib/db";
import { enrichLead, DEMO_ORGANIZER_ID } from "@/lib/leads";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const lead = await getLeadById(params.id);
  if (!lead || lead.organizer_id !== DEMO_ORGANIZER_ID) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const body = await req.json().catch(() => null) as any;
  const status: LeadStatus | undefined = body?.status;
  if (!status || !["pending", "confirmed", "declined"].includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }
  const bookingAmount =
    status === "confirmed" && typeof body?.bookingAmount === "number" ? body.bookingAmount : null;

  const updated = await updateLeadStatus(params.id, status, bookingAmount);
  return NextResponse.json({ lead: updated ? await enrichLead(updated) : null });
}
