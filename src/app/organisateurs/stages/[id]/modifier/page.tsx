import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { StageFormWizard } from "@/components/organizer/stage-form-wizard";
import { getSessionUser } from "@/lib/session";
import { getStageByIdDb } from "@/lib/db";

export const metadata: Metadata = { title: "Modifier un stage" };
export const dynamic = "force-dynamic";

export default async function EditStagePage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || user.role !== "organizer") {
    redirect(`/organisateurs/connexion?next=/organisateurs/stages/${params.id}/modifier`);
  }

  const stage = await getStageByIdDb(params.id);
  if (!stage || stage.organizer_id !== user.id) {
    notFound();
  }

  return (
    <div className="container-page py-10">
      <p className="text-sm text-mist-500">Espace organisateur</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-ink">Modifier « {stage.title} »</h1>
      <div className="mt-8">
        <StageFormWizard
          editStageId={stage.id}
          initialSlug={stage.slug}
          initialValues={{
            title: stage.title,
            city: stage.city,
            level: stage.level,
            description: stage.description,
            start: stage.start_date,
            end: stage.end_date,
            spots: stage.spots_total,
            price: stage.price_per_person,
            accommodationMode: stage.accommodation_mode,
            priceWithAccommodation: stage.price_with_accommodation ?? 400,
            externalUrl: stage.external_url,
            photos: JSON.parse(stage.photos || "[]"),
          }}
        />
      </div>
    </div>
  );
}
