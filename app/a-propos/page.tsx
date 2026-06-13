import type { Metadata } from "next";
import { about, business } from "@/config/content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Eye, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez VoisinTech : un service de dépannage informatique humain et de proximité à Toulouse. Patience, transparence, proximité.",
};

const valueIcons = [Heart, Eye, MapPin];

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">À propos de VoisinTech</h1>

        <div className="grid md:grid-cols-3 gap-10 mb-16">
          <div className="md:col-span-1">
            <div
              className="aspect-square rounded-3xl bg-primary/10 flex items-center justify-center"
              role="img"
              aria-label="Photo du technicien VoisinTech"
            >
              <span className="text-6xl" aria-hidden="true">👨‍💻</span>
            </div>
          </div>
          <div className="md:col-span-2">
            {about.story.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4 text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Mes valeurs</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {about.values.map((value, i) => {
              const Icon = valueIcons[i] || Heart;
              return (
                <div key={value.title} className="card text-center">
                  <Icon className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card bg-primary/5">
          <h2 className="text-xl font-bold mb-4">Informations légales</h2>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Raison sociale :</strong> {business.name}</li>
            <li><strong>SIRET :</strong> {business.siret}</li>
            <li><strong>Assurance :</strong> RC Professionnelle</li>
            <li><strong>Zone :</strong> {business.city} et {business.serviceRadius}</li>
          </ul>
        </section>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/devis">Demander un devis gratuit</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
