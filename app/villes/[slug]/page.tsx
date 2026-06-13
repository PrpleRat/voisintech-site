import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, getCityBySlug } from "@/config/cities";
import { business, services } from "@/config/content";
import { CallButton } from "@/components/CallButton";
import { Button } from "@/components/ui/button";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = getCityBySlug(params.slug);
  if (!city) return {};
  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: { canonical: `${business.website}/villes/${city.slug}` },
  };
}

export default function CityPage({ params }: Props) {
  const city = getCityBySlug(params.slug);
  if (!city) notFound();

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Dépannage informatique ${city.name}`,
    provider: { "@type": "LocalBusiness", name: business.name },
    areaServed: { "@type": "City", name: city.name },
    description: city.intro,
  };

  return (
    <div className="section-padding">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />
      <div className="container-page max-w-4xl">
        <p className="text-success font-semibold mb-2">VoisinTech — {city.name}</p>
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

        <h2 className="text-2xl font-bold mb-4">Services à {city.name}</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {services.slice(0, 4).map((s) => (
            <div key={s.id} className="card">
              <h3 className="font-bold">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{s.price}</p>
            </div>
          ))}
        </div>

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
