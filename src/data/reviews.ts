import { Review } from "@/types";

const POOL: Omit<Review, "id">[] = [
  {
    author: "Camille R.",
    rating: 5,
    date: "2026-07-02",
    comment: "Stage incroyable, le coach est ultra pédagogue et l'ambiance de groupe était top. Je repars avec un vrai niveau en plus.",
    avatarSeed: "camille-r",
  },
  {
    author: "Nicolas B.",
    rating: 5,
    date: "2026-06-18",
    comment: "Organisation parfaite du début à la fin, les créneaux vidéo-analyse ont changé ma façon de jouer au filet.",
    avatarSeed: "nicolas-b",
  },
  {
    author: "Sofia M.",
    rating: 4,
    date: "2026-05-29",
    comment: "Très bon stage, niveau du groupe bien équilibré. Seul bémol : les courts étaient un peu loin de l'hébergement.",
    avatarSeed: "sofia-m",
  },
  {
    author: "Antoine G.",
    rating: 5,
    date: "2026-05-11",
    comment: "Deuxième stage avec ce coach, toujours aussi bon. Réservation et paiement hyper simples sur la plateforme.",
    avatarSeed: "antoine-g",
  },
  {
    author: "Julie P.",
    rating: 5,
    date: "2026-04-22",
    comment: "Parfait pour progresser vite : beaucoup de temps de jeu, peu de théorie inutile. Je recommande à 100%.",
    avatarSeed: "julie-p",
  },
  {
    author: "Yanis K.",
    rating: 4,
    date: "2026-04-03",
    comment: "Super stage, bon rapport qualité/prix. L'annulation flexible m'a rassuré au moment de réserver.",
    avatarSeed: "yanis-k",
  },
];

export function buildReviews(seedOffset: number, count: number): Review[] {
  const list: Review[] = [];
  for (let i = 0; i < count; i++) {
    const base = POOL[(i + seedOffset) % POOL.length];
    list.push({ ...base, id: `r-${seedOffset}-${i}` });
  }
  return list;
}
