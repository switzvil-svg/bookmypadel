import { NextRequest, NextResponse } from "next/server";
import { getLeadByToken } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { stageId: string; userId: string; token: string } }
) {
  const lead = await getLeadByToken(params.token);

  if (!lead || lead.stage_id !== params.stageId || lead.user_id !== params.userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(lead.redirect_url);
}
