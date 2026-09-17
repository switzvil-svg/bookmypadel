import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account/sidebar";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || user.role !== "player") {
    redirect("/connexion?next=/compte");
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Mon compte</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <AccountSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}
