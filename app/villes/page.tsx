import type { Metadata } from "next";
import Link from "next/link";
import { cities } from "@/config/cities";
import { business } from "@/config/content";

export const metadata: Metadata = {
  title: "Villes desservies — Dépannage informatique Toulouse et environs",
  description:
    "VoisinTech intervient à Toulouse, Blagnac, Colomiers, Tournefeuille, Balma, L'Union et environs.",
};

export default function VillesPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Villes desservies</h1>
        <p className="text-lg text-gray-600 mb-10">
          Intervention à domicile dans un rayon de {business.serviceRadius} autour de Toulouse.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {cities.map((city) => (
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
      </div>
    </div>
  );
}
