"use client";

import { useRegion } from "@/components/RegionProvider";
import { business } from "@/config/content";
import { getCitiesByRegion } from "@/config/cities";

export function LocalBusinessSchema() {
  const { config, region } = useRegion();
  const servedCities = getCitiesByRegion(region);

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${business.website}/#localbusiness-${region}`,
    name: business.name,
    description: `Dépannage informatique, formation et assistance numérique à domicile à ${config.hubCity} et environs. Spécialiste seniors.`,
    url: business.website,
    telephone: `+33${business.phoneRaw.replace(/^0/, "")}`,
    email: business.email,
    image: `${business.website}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: config.hubCity,
      addressRegion: region === "lourdes" ? "Hautes-Pyrénées" : "Occitanie",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: config.geo.lat,
      longitude: config.geo.lng,
    },
    areaServed: servedCities.map((city) => ({
      "@type": "City",
      name: city.name,
    })),
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
