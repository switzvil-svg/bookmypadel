import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/components/auth/auth-provider";
import { getSessionUser } from "@/lib/session";
import { cn } from "@/lib/utils";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BookMyPadel — Trouvez votre stage de padel",
    template: "%s · BookMyPadel",
  },
  description:
    "Le comparateur des stages de padel : trouvez, comparez et entrez en contact avec les meilleurs coachs et clubs d'Europe.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64x64.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: "/favicon-64x64.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <html lang="fr" className={cn(display.variable, sans.variable)}>
      <body className="flex min-h-screen flex-col">
        <AuthProvider initialUser={user ? { id: user.id, name: user.name, email: user.email } : null}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
