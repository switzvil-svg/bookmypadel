import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { createStageForOrganizer } from "@/lib/stages";
import { LEVEL_LABEL } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "organizer") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as any;
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const city = typeof body?.city === "string" ? body.city.trim() : "";
  const level = typeof body?.level === "string" ? body.level : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const start = typeof body?.start === "string" ? body.start : "";
  const end = typeof body?.end === "string" ? body.end : "";
  const spots = Number(body?.spots);
  const price = Number(body?.price);
  const accommodation = Boolean(body?.accommodation);
  const externalUrl = typeof body?.externalUrl === "string" ? body.externalUrl.trim() : "";
  const photos = Array.isArray(body?.photos) ? body.photos.filter((p: unknown) => typeof p === "string") : [];

  if (!title || title.length < 4) {
    return NextResponse.json({ error: "Titre invalide." }, { status: 400 });
  }
  if (!city) {
    return NextResponse.json({ error: "Ville requise." }, { status: 400 });
  }
  if (!(level in LEVEL_LABEL)) {
    return NextResponse.json({ error: "Niveau invalide." }, { status: 400 });
  }
  if (!start || !end || new Date(end) < new Date(start)) {
    return NextResponse.json({ error: "Dates invalides." }, { status: 400 });
  }
  if (!Number.isFinite(spots) || spots < 1) {
    return NextResponse.json({ error: "Nombre de places invalide." }, { status: 400 });
  }
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
  }
  if (!externalUrl) {
    return NextResponse.json({ error: "Lien de contact requis." }, { status: 400 });
  }

  const { slug } = await createStageForOrganizer(user.id, {
    title,
    city,
    level,
    description,
    start,
    end,
    spots,
    price,
    accommodation,
    externalUrl,
    photos,
  });

  return NextResponse.json({ slug });
}
