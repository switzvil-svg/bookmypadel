import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(_req: NextRequest, { params }: { params: { filename: string } }) {
  // Filenames are always server-generated UUIDs (see /api/organizer/upload) — reject
  // anything else outright to rule out path traversal via crafted filenames.
  if (!/^[a-f0-9-]+\.(jpg|jpeg|png|webp|gif)$/i.test(params.filename)) {
    return NextResponse.json({ error: "Nom de fichier invalide." }, { status: 400 });
  }

  const ext = params.filename.split(".").pop()!.toLowerCase();
  const { env } = await getCloudflareContext({ async: true });
  const object = await env.PHOTOS.get(`stages/${params.filename}`);

  if (!object) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  return new NextResponse(object.body as unknown as BodyInit, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
