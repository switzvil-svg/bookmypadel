"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Stage } from "@/types";
import { CoverArt } from "@/components/ui/cover-art";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { formatPrice, formatDateRange } from "@/lib/utils";

export function StageCard({ stage }: { stage: Stage }) {
  const lowSpots = stage.spotsLeft > 0 && stage.spotsLeft <= 3;
  const full = stage.spotsLeft === 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
      <Link
        href={`/stages/${stage.slug}`}
        className="group block overflow-hidden rounded-lg border border-mist-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
      >
        <div className="relative h-48 overflow-hidden">
          <div className="h-full w-full transition-transform duration-500 ease-court group-hover:scale-105">
            <CoverArt seed={stage.coverSeed} className="h-full w-full" rounded="rounded-none" />
          </div>
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {stage.featured && <Badge tone="citron">À la une</Badge>}
            {stage.popular && !stage.featured && <Badge tone="ink">Populaire</Badge>}
            {lowSpots && <Badge tone="warning">Dernières places</Badge>}
            {full && <Badge tone="mist">Complet</Badge>}
          </div>
          <FavoriteButton id={stage.id} className="absolute right-3 top-3" />
        </div>

        <div className="space-y-2.5 p-4">
          <div className="flex items-center justify-between text-xs text-mist-600">
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} /> {stage.city}, {stage.country}
            </span>
            <Rating value={stage.rating} count={stage.reviewCount} size={12} />
          </div>

          <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-ink">
            {stage.title}
          </h3>

          <p className="text-sm text-mist-600">
            avec <span className="font-medium text-ink">{stage.coach.name}</span> · {stage.coach.club}
          </p>

          <div className="flex items-center gap-3 text-xs text-mist-500">
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={13} /> {formatDateRange(stage.startDate, stage.endDate)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={13} /> {stage.maxParticipants} max
            </span>
          </div>

          <div className="flex items-end justify-between border-t border-mist-100 pt-3">
            <div>
              <span className="text-lg font-bold text-ink">{formatPrice(stage.pricePerPerson)}</span>
              <span className="text-xs text-mist-500"> / pers.</span>
            </div>
            <Badge tone="court" className="capitalize">
              {stage.level.replace("-", " ")}
            </Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
