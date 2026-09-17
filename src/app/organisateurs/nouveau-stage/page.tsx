import { Metadata } from "next";
import { StageFormWizard } from "@/components/organizer/stage-form-wizard";

export const metadata: Metadata = { title: "Publier un stage" };

export default function NewStagePage() {
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
