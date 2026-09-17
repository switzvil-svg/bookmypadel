import { Coach, OrganizerStageRow, Stage, Level } from "@/types";
import {
  DbStage,
  createStage,
  listStages,
  listStagesByOrganizer,
  getStageBySlugDb,
  stageSlugExists,
  findUserById,
} from "@/lib/db";
import { coaches } from "@/data/coaches";
import { buildReviews } from "@/data/reviews";
import { PROGRAM_STANDARD, AMENITIES_BASE } from "@/data/stages";
import { formatDateRange } from "@/lib/utils";

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "stage";
  let candidate = base;
  let i = 2;
  while (await stageSlugExists(candidate)) {
    candidate = `${base}-${i}`;
    i++;
  }
  return candidate;
}

async function resolveCoach(organizerId: string, externalUrl: string): Promise<Coach> {
  const mockCoach = coaches.find((c) => c.id === organizerId);
  if (mockCoach) return mockCoach;

  const user = await findUserById(organizerId);
  return {
    id: organizerId,
    name: user?.name ?? "Organisateur",
    club: "Organisateur BookMyPadel",
    bio: "",
    avatarSeed: organizerId,
    certified: false,
    yearsExperience: 0,
    rating: 5,
    reviewCount: 0,
    externalUrl,
    contactMethod: "site",
  };
}

export async function enrichStage(row: DbStage): Promise<Stage> {
  const reviews = buildReviews(row.id.length, Math.max(3, 5 - (row.id.length % 3)));
  const rating =
    Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 || 4.8;
  const coach = await resolveCoach(row.organizer_id, row.external_url);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    city: row.city,
    region: row.region,
    country: row.country,
    coach,
    level: row.level as Level,
    pricePerPerson: row.price_per_person,
    durationDays: row.duration_days,
    startDate: row.start_date,
    endDate: row.end_date,
    spotsTotal: row.spots_total,
    spotsLeft: row.spots_left,
    rating,
    reviewCount: reviews.length * 11 + 6,
    accommodationIncluded: Boolean(row.accommodation_included),
    maxParticipants: row.spots_total,
    coverSeed: row.id,
    gallerySeeds: [row.id + "-1", row.id + "-2", row.id + "-3", row.id + "-4"],
    description: row.description,
    program: PROGRAM_STANDARD,
    amenities: AMENITIES_BASE,
    featured: Boolean(row.featured),
    popular: Boolean(row.popular),
    reviews,
  };
}

export async function getAllStages(): Promise<Stage[]> {
  try {
    const rows = await listStages();
    return await Promise.all(rows.map(enrichStage));
  } catch (err) {
    // A DB outage (unmigrated schema, D1 hiccup, ...) must degrade to an
    // empty listing, never take down every public page that renders it.
    console.error("[lib/stages] getAllStages failed:", err);
    return [];
  }
}

export async function getStageBySlug(slug: string): Promise<Stage | undefined> {
  try {
    const row = await getStageBySlugDb(slug);
    if (!row) return undefined;
    return await enrichStage(row);
  } catch (err) {
    console.error("[lib/stages] getStageBySlug(%s) failed:", slug, err);
    return undefined;
  }
}

export async function getStagesByIds(ids: string[]): Promise<Stage[]> {
  if (ids.length === 0) return [];
  const all = await getAllStages();
  return all.filter((s) => ids.includes(s.id));
}

export function citiesFrom(stages: Stage[]): string[] {
  return Array.from(new Set(stages.map((s) => s.city))).sort();
}

export async function getOrganizerStageRows(organizerId: string): Promise<OrganizerStageRow[]> {
  try {
    const rows = await listStagesByOrganizer(organizerId);
    // Views/bookings/revenue/boosted aren't tracked anywhere yet (no page-
    // view analytics, no booking pipeline beyond leads) — reporting them as
    // 0 is the honest value, not a placeholder to fill in later.
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      city: row.city,
      dateRange: formatDateRange(row.start_date, row.end_date),
      spotsLeft: row.spots_left,
      spotsTotal: row.spots_total,
      status: row.spots_left === 0 ? "complet" : "publie",
      views: 0,
      bookings: 0,
      revenue: 0,
      boosted: false,
    }));
  } catch (err) {
    console.error("[lib/stages] getOrganizerStageRows(%s) failed:", organizerId, err);
    return [];
  }
}

export async function createStageForOrganizer(
  organizerId: string,
  input: {
    title: string;
    city: string;
    level: string;
    description: string;
    start: string;
    end: string;
    spots: number;
    price: number;
    accommodation: boolean;
    externalUrl: string;
    photos: string[];
  }
): Promise<{ slug: string }> {
  const slug = await generateUniqueSlug(input.title);
  const start = new Date(input.start);
  const end = new Date(input.end);
  const durationDays = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  await createStage({
    slug,
    organizerId,
    title: input.title,
    city: input.city,
    region: "",
    country: "France",
    level: input.level,
    description: input.description,
    pricePerPerson: input.price,
    durationDays,
    startDate: input.start,
    endDate: input.end,
    spotsTotal: input.spots,
    accommodationIncluded: input.accommodation,
    externalUrl: input.externalUrl,
    photos: input.photos,
  });

  return { slug };
}
