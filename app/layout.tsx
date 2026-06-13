import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCallButton } from "@/components/StickyCallButton";
import { business } from "@/config/content";
import "./globals.css";

export const metadata: Metadata = {
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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyCallButton />
      </body>
    </html>
  );
}
