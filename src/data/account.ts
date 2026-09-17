import { Booking, OrganizerStageRow } from "@/types";
import { stages } from "./stages";

export const myBookings: Booking[] = [
  {
    id: "b1",
    stageId: stages[0].id,
    stageTitle: stages[0].title,
    city: stages[0].city,
    dateRange: "5 – 9 oct. 2026",
    participants: 2,
    totalPrice: 698,
    status: "confirmee",
    coverSeed: stages[0].coverSeed,
  },
  {
    id: "b2",
    stageId: stages[1].id,
    stageTitle: stages[1].title,
    city: stages[1].city,
    dateRange: "12 – 18 oct. 2026",
    participants: 1,
    totalPrice: 690,
    status: "en-attente",
    coverSeed: stages[1].coverSeed,
  },
  {
    id: "b3",
    stageId: stages[6].id,
    stageTitle: stages[6].title,
    city: stages[6].city,
    dateRange: "3 – 7 juin 2026",
    participants: 1,
    totalPrice: 219,
    status: "terminee",
    coverSeed: stages[6].coverSeed,
  },
];

export const myWishlist = [stages[3], stages[4], stages[7]];

export const organizerStages: OrganizerStageRow[] = [
  { id: stages[0].id, title: stages[0].title, city: stages[0].city, dateRange: "5 – 9 oct.", spotsLeft: 2, spotsTotal: 12, status: "publie", views: 1840, bookings: 10, revenue: 3490, boosted: true },
  { id: stages[6].id, title: stages[6].title, city: stages[6].city, dateRange: "29 sept. – 3 oct.", spotsLeft: 5, spotsTotal: 10, status: "publie", views: 690, bookings: 5, revenue: 1095, boosted: false },
  { id: stages[13].id, title: stages[13].title, city: stages[13].city, dateRange: "22 – 25 sept.", spotsLeft: 8, spotsTotal: 12, status: "publie", views: 420, bookings: 4, revenue: 1116, boosted: false },
  { id: "draft-1", title: "Stage vacances de Noël (brouillon)", city: "Nice", dateRange: "22 – 26 déc.", spotsLeft: 12, spotsTotal: 12, status: "brouillon", views: 0, bookings: 0, revenue: 0, boosted: false },
];

export const revenueByMonth = [
  { month: "Avr", revenue: 2400, bookings: 8 },
  { month: "Mai", revenue: 3100, bookings: 11 },
  { month: "Juin", revenue: 2800, bookings: 9 },
  { month: "Juil", revenue: 4200, bookings: 15 },
  { month: "Août", revenue: 3900, bookings: 13 },
  { month: "Sept", revenue: 5700, bookings: 19 },
];
