import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyContactButtons } from "@/components/StickyContactButtons";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { Analytics } from "@/components/Analytics";
import { business } from "@/config/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(business.website),
  title: {
    default: `${business.name} — Dépannage informatique à domicile Toulouse`,
    template: `%s | ${business.name}`,
  },
  description:
    "VoisinTech : dépannage informatique, formation et assistance numérique à domicile à Toulouse. Seniors, familles et PME. Devis gratuit, sans jargon.",
  keywords: [
    "dépannage informatique Toulouse",
    "réparation ordinateur domicile",
    "aide seniors numérique",
    "technicien informatique Toulouse",
    "dépannage PC Blagnac",
    "aide informatique Colomiers",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: business.website,
    siteName: business.name,
    title: `${business.name} — Dépannage informatique à domicile Toulouse`,
    description:
      "Dépannage informatique à domicile à Toulouse et environs. Devis gratuit, tarif senior 40€/h.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: business.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: business.name,
    description: "Dépannage informatique à domicile — Toulouse",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: business.website,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <Analytics />
        <LocalBusinessSchema />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyContactButtons />
      </body>
    </html>
  );
}
