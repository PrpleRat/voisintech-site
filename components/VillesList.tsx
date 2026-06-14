"use client";

import { getCitiesByRegion } from "@/config/cities";
import { useRegion } from "@/components/RegionProvider";
import Link from "next/link";

export function VillesList() {
  const { config, region } = useRegion();
  const regionCities = getCitiesByRegion(region);

  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Villes desservies</h1>
        <p className="text-lg text-gray-600 mb-10">
          Intervention à domicile dans un rayon de {config.serviceRadius} autour de{" "}
          {config.hubCity}.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {regionCities.map((city) => (
            <Link
              key={city.slug}
              href={`/villes/${city.slug}`}
              className="card hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-bold text-primary">{city.name}</h2>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{city.intro}</p>
            </Link>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-8 text-center">
          Votre ville n&apos;est pas listée ?{" "}
          <Link href="/contact" className="text-primary font-medium hover:underline">
            Contactez-nous
          </Link>{" "}
          — nous intervenons aussi dans les villages alentour.
        </p>
      </div>
    </div>
  );
}
