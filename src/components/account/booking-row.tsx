import Link from "next/link";
import { Users, CalendarDays } from "lucide-react";
import { Booking } from "@/types";
import { CoverArt } from "@/components/ui/cover-art";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

const STATUS_TONE: Record<Booking["status"], "court" | "warning" | "mist" | "success"> = {
  confirmee: "court",
  "en-attente": "warning",
  annulee: "mist",
  terminee: "success",
};
const STATUS_LABEL: Record<Booking["status"], string> = {
  confirmee: "Confirmée",
  "en-attente": "En attente",
  annulee: "Annulée",
  terminee: "Terminée",
};

export function BookingRow({ booking }: { booking: Booking }) {
  return (
    <Link
      href={`/stages/${booking.stageId}`}
      className="flex flex-col gap-4 rounded-lg border border-mist-200 bg-white p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center"
    >
      <div className="h-24 w-full shrink-0 overflow-hidden rounded-md sm:w-32">
        <CoverArt seed={booking.coverSeed} className="h-full w-full" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-display font-semibold text-ink">{booking.stageTitle}</p>
          <Badge tone={STATUS_TONE[booking.status]}>{STATUS_LABEL[booking.status]}</Badge>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mist-500">
          <span>{booking.city}</span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={12} /> {booking.dateRange}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={12} /> {booking.participants} participant{booking.participants > 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="font-display font-bold text-ink">{formatPrice(booking.totalPrice)}</p>
      </div>
    </Link>
  );
}
