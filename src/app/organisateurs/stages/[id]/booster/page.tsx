import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Zap, Clock, Gauge, AlertCircle } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { getStageByIdDb } from "@/lib/db";
import { getSlotAvailability, hasActiveBoost } from "@/lib/boosts";
import { BOOST_CONFIG } from "@/lib/config";
import { BoostCheckoutButton } from "@/components/organizer/boost-checkout-button";

export const metadata: Metadata = { title: "Booster un stage" };
export const dynamic = "force-dynamic";

function formatBoostPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export default async function BoostStagePage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || user.role !== "organizer") {
    redirect(`/organisateurs/connexion?next=/organisateurs/stages/${params.id}/booster`);
  }

  const stage = await getStageByIdDb(params.id);
  if (!stage || stage.organizer_id !== user.id) {
    notFound();
  }

  const [availability, alreadyBoosted] = await Promise.all([
    getSlotAvailability(),
    hasActiveBoost(params.id),
  ]);

  return (
    <div className="container-page flex flex-col items-center py-14">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-citron-200 text-ink">
        <Zap size={22} />
      </span>
      <h1 className="mt-4 text-center font-display text-2xl font-bold text-ink">
        Booster « {stage.title} »
      </h1>
      <p className="mt-1 text-center text-sm text-mist-600">
        Mettez ce stage en avant sur la page d’accueil, section « À la une ».
      </p>

      <div className="mt-8 w-full max-w-md rounded-lg border border-mist-200 bg-white p-6">
        <p className="font-display text-3xl font-bold text-ink">
          {formatBoostPrice(BOOST_CONFIG.PRICE_EUR)}
        </p>
        <ul className="mt-4 space-y-2.5 text-sm text-mist-700">
          <li className="flex items-center gap-2">
            <Clock size={16} className="shrink-0 text-court-500" /> {BOOST_CONFIG.DURATION_DAYS} jours
            en page d’accueil
          </li>
          <li className="flex items-center gap-2">
            <Gauge size={16} className="shrink-0 text-court-500" />
            {availability.remaining} place{availability.remaining !== 1 ? "s" : ""} restante
            {availability.remaining !== 1 ? "s" : ""} sur {availability.max}
          </li>
        </ul>

        <div className="mt-6">
          {alreadyBoosted ? (
            <p className="flex items-center gap-2 rounded-md bg-court-50 p-3 text-sm text-court-700">
              <AlertCircle size={16} className="shrink-0" /> Ce stage a déjà une mise en avant active.
            </p>
          ) : availability.full ? (
            <p className="flex items-center gap-2 rounded-md bg-mist-100 p-3 text-sm text-mist-600">
              <AlertCircle size={16} className="shrink-0" /> Tous les slots sont actuellement occupés,
              réessayez plus tard.
            </p>
          ) : (
            <BoostCheckoutButton stageId={params.id} />
          )}
        </div>
      </div>
    </div>
  );
}
