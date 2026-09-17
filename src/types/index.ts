export type Level = "debutant" | "intermediaire" | "confirme" | "tous-niveaux";

export const LEVEL_LABEL: Record<Level, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  confirme: "Confirmé",
  "tous-niveaux": "Tous niveaux",
};

export type ContactMethod = "site" | "whatsapp" | "formulaire";

export const CONTACT_METHOD_LABEL: Record<ContactMethod, string> = {
  site: "Site web",
  whatsapp: "WhatsApp",
  formulaire: "Formulaire de contact",
};

export interface Coach {
  id: string;
  name: string;
  club: string;
  bio: string;
  avatarSeed: string;
  certified: boolean;
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  /** Where a lead is sent after clicking "Voir l'offre" — the organizer's own site/WhatsApp/form. */
  externalUrl: string;
  contactMethod: ContactMethod;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatarSeed: string;
}

export interface Stage {
  id: string;
  slug: string;
  title: string;
  city: string;
  region: string;
  country: string;
  coach: Coach;
  level: Level;
  pricePerPerson: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  spotsTotal: number;
  spotsLeft: number;
  rating: number;
  reviewCount: number;
  accommodationIncluded: boolean;
  maxParticipants: number;
  coverSeed: string;
  gallerySeeds: string[];
  description: string;
  program: { day: string; title: string; description: string }[];
  amenities: string[];
  featured: boolean;
  popular: boolean;
  reviews: Review[];
}

export interface Booking {
  id: string;
  stageId: string;
  stageTitle: string;
  city: string;
  dateRange: string;
  participants: number;
  totalPrice: number;
  status: "confirmee" | "en-attente" | "annulee" | "terminee";
  coverSeed: string;
}

export interface OrganizerStageRow {
  id: string;
  title: string;
  city: string;
  dateRange: string;
  spotsLeft: number;
  spotsTotal: number;
  status: "publie" | "brouillon" | "complet";
  views: number;
  bookings: number;
  revenue: number;
  boosted: boolean;
}
