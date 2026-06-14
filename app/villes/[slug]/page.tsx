import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, getCityBySlug } from "@/config/cities";
import { business, services } from "@/config/content";
import { CallButton } from "@/components/CallButton";
import { FAQAccordion } from "@/components/FAQAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
} from "@/lib/seo";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = getCityBySlug(params.slug);
  if (!city) return {};
  return pageMetadata({
    title: city.metaTitle,
    description: city.metaDescription,
    path: `/villes/${city.slug}`,
    keywords: [
      "voisintech",
      `dépannage informatique ${city.name}`,
      `depannage informatique ${city.name.toLowerCase()}`,
      `réparation ordinateur ${city.name}`,
      "technicien informatique à domicile",
    ],
  });
}

export default function CityPage({ params }: Props) {
  const city = getCityBySlug(params.slug);
  if (!city) notFound();

  const pageUrl = absoluteUrl(`/villes/${city.slug}`);
  const nearbyCities = (city.nearbySlugs ?? [])
    .map((slug) => getCityBySlug(slug))
    .filter(Boolean);

  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Dépannage informatique ${city.name}`,
      provider: {
        "@type": "LocalBusiness",
        name: business.name,
        url: business.website,
        telephone: `+33${business.phoneRaw.replace(/^0/, "")}`,
      },
      areaServed: { "@type": "City", name: city.name },
      description: city.intro,
      url: pageUrl,
    },
    breadcrumbJsonLd([
      { name: "Accueil", path: "/" },
      { name: "Villes desservies", path: "/villes" },
      { name: city.name, path: `/villes/${city.slug}` },
    ]),
  ];

  if (city.faq?.length) {
    schemas.push(faqJsonLd(city.faq, pageUrl));
  }

  return (
    <div className="section-padding">
      <JsonLd data={schemas} />
      <div className="container-page max-w-4xl">
        <nav aria-label="Fil d'Ariane" className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          {" / "}
          <Link href="/villes" className="hover:text-primary">
            Villes
          </Link>
          {" / "}
          <span className="text-gray-700">{city.name}</span>
        </nav>

        <p className="text-success font-semibold mb-2">
          VoisinTech — voisintech.fr
        </p>
        <h1 className="text-4xl font-bold mb-6">
          Dépannage informatique à domicile — {city.name}
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">{city.intro}</p>

        <ul className="space-y-3 mb-10">
          {city.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-gray-700">
              <span className="text-success font-bold">✓</span> {h}
            </li>
          ))}
        </ul>

        {city.body?.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="text-gray-700 leading-relaxed mb-6"
          >
            {paragraph}
          </p>
        ))}

        {city.neighborhoods && city.neighborhoods.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">
              Quartiers desservis à {city.name}
            </h2>
            <p className="text-gray-600 mb-4">
              Intervention à domicile dans tous ces secteurs — et au-delà sur
              demande :
            </p>
            <ul className="flex flex-wrap gap-2">
              {city.neighborhoods.map((q) => (
                <li
                  key={q}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {q}
                </li>
              ))}
            </ul>
          </section>
        )}

        <h2 className="text-2xl font-bold mb-4">
          Services de dépannage informatique à {city.name}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {services.slice(0, 4).map((s) => (
            <div key={s.id} className="card">
              <h3 className="font-bold">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{s.price}</p>
            </div>
          ))}
        </div>
        <p className="mb-10">
          <Link href="/services" className="text-primary font-semibold hover:underline">
            Voir tous les services et tarifs VoisinTech →
          </Link>
        </p>

        {city.faq && city.faq.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6">
              FAQ — dépannage informatique {city.name}
            </h2>
            <FAQAccordion items={city.faq} />
          </section>
        )}

        {nearbyCities.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Villes voisines</h2>
            <ul className="flex flex-wrap gap-3">
              {nearbyCities.map(
                (c) =>
                  c && (
                    <li key={c.slug}>
                      <Link
                        href={`/villes/${c.slug}`}
                        className="text-primary hover:underline font-medium"
                      >
                        Dépannage informatique {c.name}
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </section>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/devis">Demander un devis gratuit</Link>
          </Button>
          <CallButton />
        </div>

        <p className="mt-8 text-gray-500 text-sm">
          <Link href="/villes" className="text-primary hover:underline">
            ← Toutes les villes desservies
          </Link>
        </p>
      </div>
    </div>
  );
}
