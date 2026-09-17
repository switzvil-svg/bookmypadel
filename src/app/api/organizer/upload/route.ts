import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });

  const urls: string[] = [];
  for (const file of files) {
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: `Format non supporté : ${file.type || "inconnu"}. Utilisez JPG, PNG, WebP ou GIF.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `« ${file.name} » dépasse la taille maximale de 8 Mo.` },
        { status: 400 }
      );
    }

    const key = `stages/${crypto.randomUUID()}.${ext}`;
    await env.PHOTOS.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });
    urls.push(`/api/uploads/stages/${key.split("/")[1]}`);
  }

  return NextResponse.json({ urls });
}
