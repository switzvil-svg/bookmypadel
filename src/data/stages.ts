import { Stage } from "@/types";
import { coaches } from "./coaches";
import { buildReviews } from "./reviews";

export const PROGRAM_STANDARD = [
  { day: "Jour 1", title: "Accueil & évaluation de niveau", description: "Test technique et tactique, constitution des groupes de niveau homogènes." },
  { day: "Jour 2", title: "Technique de fond de court", description: "Coup droit, revers, gestion du vitrage — ateliers en petits groupes." },
  { day: "Jour 3", title: "Jeu au filet & volées", description: "Positionnement, smash, bandeja — situations de match dirigées." },
  { day: "Jour 4", title: "Tactique de double", description: "Communication, couverture du court, schémas de jeu en double." },
  { day: "Jour 5", title: "Tournoi interne & bilan vidéo", description: "Mise en situation de match, débrief individuel filmé avec le coach." },
];

export const AMENITIES_BASE = ["Balles fournies", "Vidéo-analyse", "Certificat de niveau", "Assurance incluse"];

function makeStage(partial: {
  id: string;
  title: string;
  city: string;
  region: string;
  country: string;
  coachIdx: number;
  level: Stage["level"];
  price: number;
  duration: number;
  start: string;
  end: string;
  spotsTotal: number;
  spotsLeft: number;
  accommodation: boolean;
  maxParticipants: number;
  featured?: boolean;
  popular?: boolean;
  extraAmenities?: string[];
  description: string;
}): Stage {
  const coach = coaches[partial.coachIdx];
  const reviews = buildReviews(partial.id.length, Math.max(3, 5 - (partial.id.length % 3)));
  const rating =
    Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 || 4.8;
  return {
    id: partial.id,
    slug: partial.id,
    title: partial.title,
    city: partial.city,
    region: partial.region,
    country: partial.country,
    coach,
    level: partial.level,
    pricePerPerson: partial.price,
    durationDays: partial.duration,
    startDate: partial.start,
    endDate: partial.end,
    spotsTotal: partial.spotsTotal,
    spotsLeft: partial.spotsLeft,
    rating,
    reviewCount: reviews.length * 11 + 6,
    accommodationIncluded: partial.accommodation,
    accommodationMode: partial.accommodation ? "included" : "none",
    priceWithAccommodation: null,
    maxParticipants: partial.maxParticipants,
    coverSeed: partial.id,
    gallerySeeds: [partial.id + "-1", partial.id + "-2", partial.id + "-3", partial.id + "-4"],
    photos: [],
    description: partial.description,
    program: PROGRAM_STANDARD,
    amenities: [...AMENITIES_BASE, ...(partial.extraAmenities ?? [])],
    featured: !!partial.featured,
    popular: !!partial.popular,
    reviews,
  };
}

export const stages: Stage[] = [
  makeStage({
    id: "riviera-intensif-debutant",
    title: "Stage intensif débutant — Côte d'Azur",
    city: "Nice",
    region: "Provence-Alpes-Côte d'Azur",
    country: "France",
    coachIdx: 0,
    level: "debutant",
    price: 349,
    duration: 5,
    start: "2026-10-05",
    end: "2026-10-09",
    spotsTotal: 12,
    spotsLeft: 2,
    accommodation: false,
    maxParticipants: 12,
    featured: true,
    popular: true,
    description:
      "5 jours pour poser des bases solides : swing, déplacement, lecture du jeu. Groupes de 6 maximum encadrés par un coach certifié FFT.",
  }),
  makeStage({
    id: "marbella-perfectionnement",
    title: "Semaine perfectionnement à Marbella",
    city: "Marbella",
    region: "Andalousie",
    country: "Espagne",
    coachIdx: 1,
    level: "confirme",
    price: 690,
    duration: 6,
    start: "2026-10-12",
    end: "2026-10-18",
    spotsTotal: 10,
    spotsLeft: 4,
    accommodation: true,
    maxParticipants: 10,
    featured: true,
    popular: true,
    extraAmenities: ["Hébergement 4* inclus", "Navettes aéroport", "Accès piscine & spa"],
    description:
      "Immersion totale dans l'un des berceaux du padel espagnol. Hébergement, pension complète et 18h de coaching sur le terrain.",
  }),
  makeStage({
    id: "bordeaux-club-decouverte",
    title: "Week-end découverte padel",
    city: "Bordeaux",
    region: "Nouvelle-Aquitaine",
    country: "France",
    coachIdx: 2,
    level: "debutant",
    price: 129,
    duration: 2,
    start: "2026-09-26",
    end: "2026-09-27",
    spotsTotal: 16,
    spotsLeft: 9,
    accommodation: false,
    maxParticipants: 16,
    popular: true,
    description:
      "Le format idéal pour découvrir le padel en douceur : règles, gestes de base et premiers matchs encadrés sur un week-end.",
  }),
  makeStage({
    id: "lisbonne-multi-niveaux",
    title: "Stage multi-niveaux au bord du Tage",
    city: "Lisbonne",
    region: "Lisbonne",
    country: "Portugal",
    coachIdx: 3,
    level: "tous-niveaux",
    price: 460,
    duration: 4,
    start: "2026-11-02",
    end: "2026-11-05",
    spotsTotal: 20,
    spotsLeft: 11,
    accommodation: true,
    maxParticipants: 20,
    featured: true,
    extraAmenities: ["Hébergement 3* inclus", "Soirée d'équipe"],
    description:
      "Un stage pensé pour jouer en couple ou entre amis de niveaux différents : groupes ajustés chaque matin selon la progression.",
  }),
  makeStage({
    id: "sardaigne-resort-padel",
    title: "Padel Resort Week — Sardaigne",
    city: "Cagliari",
    region: "Sardaigne",
    country: "Italie",
    coachIdx: 4,
    level: "intermediaire",
    price: 890,
    duration: 7,
    start: "2026-10-24",
    end: "2026-10-31",
    spotsTotal: 14,
    spotsLeft: 6,
    accommodation: true,
    maxParticipants: 14,
    featured: true,
    extraAmenities: ["Hébergement 5* inclus", "Accès plage privée", "3 repas/jour"],
    description:
      "Une semaine resort tout compris : padel le matin, plage l'après-midi. Le format préféré des couples et groupes d'amis.",
  }),
  makeStage({
    id: "annecy-jeunes-competiteurs",
    title: "Stage compétition jeunes 14-18 ans",
    city: "Annecy",
    region: "Auvergne-Rhône-Alpes",
    country: "France",
    coachIdx: 5,
    level: "confirme",
    price: 399,
    duration: 5,
    start: "2026-10-19",
    end: "2026-10-23",
    spotsTotal: 12,
    spotsLeft: 3,
    accommodation: false,
    maxParticipants: 12,
    popular: true,
    description:
      "Préparation orientée compétition : physique, tactique de match et gestion du mental pour joueurs déjà classés.",
  }),
  makeStage({
    id: "nice-soir-apres-travail",
    title: "Cycle progression en soirée",
    city: "Nice",
    region: "Provence-Alpes-Côte d'Azur",
    country: "France",
    coachIdx: 0,
    level: "intermediaire",
    price: 219,
    duration: 5,
    start: "2026-09-29",
    end: "2026-10-03",
    spotsTotal: 10,
    spotsLeft: 5,
    accommodation: false,
    maxParticipants: 10,
    description:
      "5 séances en soirée réparties sur 2 semaines pour progresser sans poser de congés. Format populaire auprès des actifs.",
  }),
  makeStage({
    id: "malaga-intensif-confirme",
    title: "Intensif confirmé — Costa del Sol",
    city: "Malaga",
    region: "Andalousie",
    country: "Espagne",
    coachIdx: 1,
    level: "confirme",
    price: 590,
    duration: 5,
    start: "2026-11-09",
    end: "2026-11-13",
    spotsTotal: 8,
    spotsLeft: 1,
    accommodation: true,
    maxParticipants: 8,
    featured: true,
    extraAmenities: ["Hébergement 4* inclus"],
    description:
      "Petit groupe, gros volume de jeu : 20h de coaching sur 5 jours pour joueurs déjà à l'aise en compétition.",
  }),
  makeStage({
    id: "bordeaux-femmes-initiation",
    title: "Stage initiation 100% féminin",
    city: "Bordeaux",
    region: "Nouvelle-Aquitaine",
    country: "France",
    coachIdx: 2,
    level: "debutant",
    price: 159,
    duration: 3,
    start: "2026-10-07",
    end: "2026-10-09",
    spotsTotal: 14,
    spotsLeft: 7,
    accommodation: false,
    maxParticipants: 14,
    popular: true,
    description:
      "Un cadre bienveillant pour se lancer entre femmes, tous âges bienvenus. Ambiance conviviale garantie.",
  }),
  makeStage({
    id: "lisbonne-week-end-couples",
    title: "Week-end padel en couple",
    city: "Lisbonne",
    region: "Lisbonne",
    country: "Portugal",
    coachIdx: 3,
    level: "tous-niveaux",
    price: 340,
    duration: 3,
    start: "2026-10-30",
    end: "2026-11-01",
    spotsTotal: 16,
    spotsLeft: 10,
    accommodation: true,
    maxParticipants: 16,
    extraAmenities: ["Hébergement 4* inclus", "Dîner de gala"],
    description:
      "Un format pensé pour jouer et voyager à deux : coaching en duo, activités croisées et dîner de gala le samedi soir.",
  }),
  makeStage({
    id: "sardaigne-famille",
    title: "Stage famille — parents & enfants",
    city: "Cagliari",
    region: "Sardaigne",
    country: "Italie",
    coachIdx: 4,
    level: "tous-niveaux",
    price: 750,
    duration: 6,
    start: "2026-08-16",
    end: "2026-08-22",
    spotsTotal: 18,
    spotsLeft: 0,
    accommodation: true,
    maxParticipants: 18,
    extraAmenities: ["Hébergement 5* inclus", "Club enfants le matin"],
    description:
      "Padel en famille avec groupes adaptés à chaque âge, dans un resort pensé pour les enfants comme pour les parents.",
  }),
  makeStage({
    id: "annecy-etudiants",
    title: "Pack étudiants — vacances de la Toussaint",
    city: "Annecy",
    region: "Auvergne-Rhône-Alpes",
    country: "France",
    coachIdx: 5,
    level: "debutant",
    price: 99,
    duration: 3,
    start: "2026-10-21",
    end: "2026-10-23",
    spotsTotal: 20,
    spotsLeft: 14,
    accommodation: false,
    maxParticipants: 20,
    description:
      "Tarif étudiant, ambiance décontractée : l'occasion de s'initier au padel pendant les vacances de la Toussaint.",
  }),
  makeStage({
    id: "malaga-video-analyse",
    title: "Stage vidéo-analyse avancée",
    city: "Malaga",
    region: "Andalousie",
    country: "Espagne",
    coachIdx: 1,
    level: "confirme",
    price: 640,
    duration: 4,
    start: "2026-11-16",
    end: "2026-11-19",
    spotsTotal: 8,
    spotsLeft: 2,
    accommodation: true,
    maxParticipants: 8,
    extraAmenities: ["Hébergement 4* inclus", "Capteurs de performance"],
    description:
      "Chaque session est filmée sous plusieurs angles pour un débrief tactique individuel poussé, en petit groupe.",
  }),
  makeStage({
    id: "nice-remise-a-niveau",
    title: "Remise à niveau technique",
    city: "Nice",
    region: "Provence-Alpes-Côte d'Azur",
    country: "France",
    coachIdx: 0,
    level: "intermediaire",
    price: 279,
    duration: 4,
    start: "2026-09-22",
    end: "2026-09-25",
    spotsTotal: 12,
    spotsLeft: 8,
    accommodation: false,
    maxParticipants: 12,
    description:
      "Pour les joueurs réguliers qui veulent corriger des défauts techniques installés et repartir sur de bonnes bases.",
  }),
];

export const cities = Array.from(new Set(stages.map((s) => s.city))).sort();

export function getStageBySlug(slug: string) {
  return stages.find((s) => s.slug === slug);
}
