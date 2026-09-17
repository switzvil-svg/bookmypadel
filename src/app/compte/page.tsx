import Link from "next/link";
import { CalendarCheck, Heart, MessageSquareText, ArrowRight } from "lucide-react";
import { myBookings, myWishlist } from "@/data/account";
import { BookingRow } from "@/components/account/booking-row";

export default function AccountOverviewPage() {
  const upcoming = myBookings.filter((b) => b.status !== "terminee" && b.status !== "annulee");

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: CalendarCheck, label: "Réservations", value: myBookings.length, href: "/compte/reservations" },
          { icon: Heart, label: "Favoris", value: myWishlist.length, href: "/compte/favoris" },
          { icon: MessageSquareText, label: "Avis laissés", value: 2, href: "/compte/avis" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="rounded-lg border border-mist-200 bg-white p-5 transition-shadow hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-court-50 text-court-600">
              <s.icon size={18} />
            </span>
            <p className="mt-3 font-display text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-sm text-mist-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Prochains stages</h2>
          <Link href="/compte/reservations" className="inline-flex items-center gap-1 text-sm font-semibold text-court-600 hover:text-court-700">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {upcoming.map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
