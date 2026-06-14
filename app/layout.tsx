import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { GlobalSchema } from "@/components/seo/GlobalSchema";
import { business } from "@/config/content";
import { defaultKeywords } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(business.website),
  title: {
    default: `${business.name} — Dépannage informatique à domicile Toulouse`,
    template: `%s | ${business.name}`,
  },
  description:
    "VoisinTech (voisintech.fr) : dépannage informatique à domicile à Toulouse. Réparation PC, Mac, smartphone, Wi-Fi. Seniors, familles et PME. Devis gratuit — 05 82 95 06 42.",
  keywords: defaultKeywords,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: business.name,
    title: `${business.name} — Dépannage informatique à domicile Toulouse`,
    description:
      "Dépannage informatique à domicile à Toulouse et environs. Devis gratuit, tarif senior 40€/h.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${business.name} — dépannage informatique Toulouse`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: business.name,
    description: "Dépannage informatique à domicile — Toulouse",
    images: ["/opengraph-image.png"],
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
        <GlobalSchema />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
