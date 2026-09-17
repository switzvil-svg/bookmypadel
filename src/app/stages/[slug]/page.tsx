import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MapPin, CalendarDays, Users, BadgeCheck, Award } from "lucide-react";
import { getStageBySlug } from "@/lib/stages";
import { Gallery } from "@/components/stage/gallery";
import { OfferCTA } from "@/components/stage/offer-cta";
import { ReviewsSection } from "@/components/stage/reviews-section";
import { CrossSell } from "@/components/stage/cross-sell";
import { AvailabilityCalendar } from "@/components/stage/availability-calendar";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Reveal } from "@/components/ui/reveal";
import { LEVEL_LABEL } from "@/types";
import { formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const stage = await getStageBySlug(params.slug);
  if (!stage) return {};
  return { title: stage.title, description: stage.description };
}

export default async function StageDetailPage({ params }: { params: { slug: string } }) {
  const stage = await getStageBySlug(params.slug);
  if (!stage) notFound();

  return (
    <div className="container-page py-8">
      {/* Header */}
      <Reveal>
        <div className="flex flex-wrap items-center gap-2">
          {stage.featured && <Badge tone="citron">À la une</Badge>}
          {stage.spotsLeft > 0 && stage.spotsLeft <= 3 && <Badge tone="warning">Dernières places</Badge>}
          <Badge tone="court" className="capitalize">
            {LEVEL_LABEL[stage.level]}
          </Badge>
        </div>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{stage.title}</h1>
          <FavoriteButton id={stage.id} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mist-600">
          <Rating value={stage.rating} count={stage.reviewCount} />
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} /> {stage.city}, {stage.country}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={14} /> {formatDateRange(stage.startDate, stage.endDate)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={14} /> {stage.maxParticipants} participants max
          </span>
        </div>
      </Reveal>

      {/* Gallery */}
      <Reveal className="mt-6">
        <Gallery seeds={stage.gallerySeeds.concat(stage.coverSeed)} title={stage.title} />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          {/* Description & coach */}
          <Reveal>
            <div className="flex items-center gap-4 rounded-lg border border-mist-200 bg-white p-5">
              <Avatar name={stage.coach.name} seed={stage.coach.avatarSeed} size={56} />
              <div className="flex-1">
                <p className="inline-flex items-center gap-1.5 font-display font-semibold text-ink">
                  {stage.coach.name}
                  {stage.coach.certified && <BadgeCheck size={16} className="text-court-500" />}
                </p>
                <p className="text-sm text-mist-600">{stage.coach.club} · {stage.coach.yearsExperience} ans d’expérience</p>
                <p className="mt-1 text-sm text-mist-600">{stage.coach.bio}</p>
              </div>
              <div className="hidden shrink-0 flex-col items-end sm:flex">
                <Rating value={stage.coach.rating} count={stage.coach.reviewCount} />
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-mist-500">
                  <Award size={12} /> Coach certifié
                </span>
              </div>
            </div>

            <h2 className="mt-8 font-display text-xl font-bold text-ink">À propos de ce stage</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist-700">{stage.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {stage.amenities.map((a) => (
                <Badge key={a} tone="mist">
                  {a}
                </Badge>
              ))}
            </div>
          </Reveal>

          {/* Program */}
          <Reveal>
            <h2 className="font-display text-xl font-bold text-ink">Programme du stage</h2>
            <ol className="mt-5 space-y-5 border-l-2 border-mist-200 pl-6">
              {stage.program.map((p) => (
                <li key={p.day} className="relative">
                  <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-court-500 bg-white" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-court-600">{p.day}</p>
                  <p className="mt-0.5 font-display font-semibold text-ink">{p.title}</p>
                  <p className="mt-1 text-sm text-mist-600">{p.description}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Calendar */}
          <Reveal>
            <h2 className="font-display text-xl font-bold text-ink">Disponibilités</h2>
            <div className="mt-5 max-w-sm">
              <AvailabilityCalendar start={stage.startDate} end={stage.endDate} />
            </div>
          </Reveal>

          {/* Reviews */}
          <Reveal>
            <ReviewsSection rating={stage.rating} reviewCount={stage.reviewCount} reviews={stage.reviews} />
          </Reveal>

          {/* Cross-sell */}
          <Reveal>
            <CrossSell city={stage.city} />
          </Reveal>
        </div>

        {/* Sticky booking module */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <OfferCTA stage={stage} />
        </div>
      </div>
    </div>
  );
}
