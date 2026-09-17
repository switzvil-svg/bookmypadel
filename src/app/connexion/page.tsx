import { Metadata } from "next";
import { UserRound } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="container-page flex flex-col items-center py-16">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-court-50 text-court-600">
        <UserRound size={22} />
      </span>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Espace joueur</h1>
      <p className="mt-1 text-sm text-mist-600">Connectez-vous ou créez votre compte joueur.</p>
      <div className="mt-8 w-full">
        <AuthForm role="player" next={searchParams.next ?? ""} loggedInRedirect="/compte" />
      </div>
    </div>
  );
}
