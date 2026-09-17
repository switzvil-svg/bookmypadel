import { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Connexion organisateur" };

export default function OrganizerConnexionPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="container-page flex flex-col items-center py-16">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-court-50 text-court-600">
        <LayoutDashboard size={22} />
      </span>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Espace organisateur</h1>
      <p className="mt-1 text-sm text-mist-600">
        Connectez-vous ou créez votre compte organisateur pour gérer vos leads.
      </p>
      <div className="mt-8 w-full">
        <AuthForm
          role="organizer"
          next={searchParams.next ?? ""}
          loggedInRedirect="/organisateurs/tableau-de-bord"
        />
      </div>
    </div>
  );
}
