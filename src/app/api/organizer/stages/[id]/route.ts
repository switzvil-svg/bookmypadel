import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { updateStageForOrganizer, deleteStageForOrganizer } from "@/lib/stages";
import { LEVEL_LABEL, AccommodationMode } from "@/types";

const ACCOMMODATION_MODES: AccommodationMode[] = ["none", "included", "optional"];

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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
  const accommodationMode: AccommodationMode = ACCOMMODATION_MODES.includes(body?.accommodationMode)
    ? body.accommodationMode
    : "none";
  const priceWithAccommodation =
    body?.priceWithAccommodation != null ? Number(body.priceWithAccommodation) : null;
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
  if (accommodationMode === "optional") {
    if (!Number.isFinite(priceWithAccommodation)) {
      return NextResponse.json(
        { error: "Le prix avec logement est requis pour un hébergement en option." },
        { status: 400 }
      );
    }
    if ((priceWithAccommodation as number) <= price) {
      return NextResponse.json(
        { error: "Le prix avec logement doit être supérieur au prix sans logement." },
        { status: 400 }
      );
    }
  }
  if (!externalUrl) {
    return NextResponse.json({ error: "Lien de contact requis." }, { status: 400 });
  }

  try {
    const result = await updateStageForOrganizer(params.id, user.id, {
      title,
      city,
      level,
      description,
      start,
      end,
      spots,
      price,
      accommodationMode,
      priceWithAccommodation: accommodationMode === "optional" ? priceWithAccommodation : null,
      externalUrl,
      photos,
    });
    if (!result.ok) {
      return NextResponse.json({ error: "Stage introuvable." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/organizer/stages/%s] update failed for organizer=%s:", params.id, user.id, err);
    return NextResponse.json({ error: "Erreur serveur, réessayez dans un instant." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || user.role !== "organizer") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const result = await deleteStageForOrganizer(params.id, user.id);
    if (!result.ok) {
      return NextResponse.json({ error: "Stage introuvable." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/organizer/stages/%s] delete failed for organizer=%s:", params.id, user.id, err);
    return NextResponse.json({ error: "Erreur serveur, réessayez dans un instant." }, { status: 500 });
  }
}
