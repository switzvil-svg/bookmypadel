import { Review } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { formatDateLong } from "@/lib/utils";

export function ReviewsSection({
  rating,
  reviewCount,
  reviews,
}: {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h2 className="font-display text-xl font-bold text-ink">Avis des participants</h2>
        <Rating value={rating} count={reviewCount} />
      </div>

      <RevealGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {reviews.map((r) => (
          <RevealItem key={r.id} className="rounded-lg border border-mist-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <Avatar name={r.author} seed={r.avatarSeed} size={36} />
              <div>
                <p className="text-sm font-semibold text-ink">{r.author}</p>
                <p className="text-xs text-mist-500">{formatDateLong(r.date)}</p>
              </div>
              <span className="ml-auto">
                <Rating value={r.rating} size={12} />
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-mist-700">{r.comment}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
