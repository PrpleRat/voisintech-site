import { business, services } from "@/config/content";
import { getCitiesByRegion } from "@/config/cities";

/** Schémas JSON-LD rendus côté serveur (visibles par Google). */
export function GlobalSchema() {
  const servedCities = getCitiesByRegion("toulouse");

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${business.website}/#localbusiness`,
    name: business.name,
    alternateName: ["voisintech", "voisintech.fr", "Voisin Tech"],
    description:
      "VoisinTech (voisintech.fr) : dépannage informatique, réparation ordinateur et assistance numérique à domicile à Toulouse et agglomération. Spécialiste seniors.",
    url: business.website,
    telephone: `+33${business.phoneRaw.replace(/^0/, "")}`,
    email: business.email,
    image: `${business.website}/logo.png`,
    logo: `${business.website}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toulouse",
      addressRegion: "Occitanie",
      postalCode: "31000",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.6047,
      longitude: 1.4442,
    },
    areaServed: servedCities.map((city) => ({
      "@type": "City",
      name: city.name,
    })),
    priceRange: "€€",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "20:00",
      },
    ],
    sameAs: [business.googleReviewUrl],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services dépannage informatique",
      itemListElement: services.slice(0, 6).map((s) => ({
        "@type": "Offer",
        name: s.title,
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.shortDescription,
        },
      })),
    },
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${business.website}/#website`,
    name: business.name,
    alternateName: ["voisintech", "voisintech.fr"],
    url: business.website,
    description:
      "Site officiel VoisinTech — dépannage informatique à domicile à Toulouse",
    publisher: { "@id": `${business.website}/#localbusiness` },
    inLanguage: "fr-FR",
  };

  const schemas = [localBusiness, webSite];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
