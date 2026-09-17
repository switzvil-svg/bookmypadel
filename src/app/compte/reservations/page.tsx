import { Metadata } from "next";
import { myBookings } from "@/data/account";
import { BookingRow } from "@/components/account/booking-row";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

export const metadata: Metadata = { title: "Mes réservations" };

export default function ReservationsPage() {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">Mes réservations</h2>
      <RevealGroup className="mt-4 space-y-3">
        {myBookings.map((b) => (
          <RevealItem key={b.id}>
            <BookingRow booking={b} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
