import { Metadata } from "next";
import { getAllStages } from "@/lib/stages";
import { Rating } from "@/components/ui/rating";
import { CoverArt } from "@/components/ui/cover-art";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { formatDateLong } from "@/lib/utils";

export const metadata: Metadata = { title: "Mes avis" };
export const dynamic = "force-dynamic";

export default async function MyReviewsPage() {
  const stages = await getAllStages();
  const MY_REVIEWS = [
    { stage: stages[6], rating: 5, date: "2026-06-05", comment: "Super cycle en soirée, parfait pour progresser sans poser de congés. Le coach est très clair dans ses explications." },
    { stage: stages[11], rating: 4, date: "2026-08-25", comment: "Belle ambiance familiale, mes enfants ont adoré. Les groupes de niveau auraient pu être un peu plus resserrés." },
  ].filter((r) => r.stage);

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">Mes avis</h2>
      <RevealGroup className="mt-4 space-y-4">
        {MY_REVIEWS.map((r) => (
          <RevealItem key={r.stage.id} className="flex gap-4 rounded-lg border border-mist-200 bg-white p-4">
            <div className="h-20 w-24 shrink-0 overflow-hidden rounded-md">
              <CoverArt seed={r.stage.coverSeed} className="h-full w-full" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-ink">{r.stage.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <Rating value={r.rating} size={12} />
                <span className="text-xs text-mist-500">{formatDateLong(r.date)}</span>
              </div>
              <p className="mt-2 text-sm text-mist-700">{r.comment}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
