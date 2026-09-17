import { Booking } from "@/types";
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
