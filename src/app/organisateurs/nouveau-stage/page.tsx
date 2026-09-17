import { Metadata } from "next";
import { redirect } from "next/navigation";
import { StageFormWizard } from "@/components/organizer/stage-form-wizard";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Publier un stage" };
export const dynamic = "force-dynamic";

export default async function NewStagePage() {
  const user = await getSessionUser();
  if (!user || user.role !== "organizer") {
    redirect("/organisateurs/connexion?next=/organisateurs/nouveau-stage");
  }

  return (
    <div className="container-page py-10">
      <p className="text-sm text-mist-500">Espace organisateur</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-ink">Publier un nouveau stage</h1>
      <div className="mt-8">
        <StageFormWizard />
      </div>
    </div>
  );
}
