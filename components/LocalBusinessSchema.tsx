import { business } from "@/config/content";

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${business.website}/#localbusiness`,
    name: business.name,
    description:
      "Dépannage informatique, formation et assistance numérique à domicile à Toulouse et agglomération. Spécialiste seniors.",
    url: business.website,
    telephone: `+33${business.phoneRaw.replace(/^0/, "")}`,
    email: business.email,
    image: `${business.website}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toulouse",
      addressRegion: "Occitanie",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.6047,
      longitude: 1.4442,
    },
    areaServed: [
      { "@type": "City", name: "Toulouse" },
      { "@type": "City", name: "Blagnac" },
      { "@type": "City", name: "Colomiers" },
      { "@type": "City", name: "Tournefeuille" },
      { "@type": "City", name: "Balma" },
      { "@type": "City", name: "L'Union" },
    ],
    priceRange: "€€",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "20:00",
      },
    ],
    sameAs: [business.googleReviewUrl],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
