import { AccountSidebar } from "@/components/account/sidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
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
