import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  Sparkles,
  Recycle,
  ArrowRightLeft,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradeInEstimator } from "@/components/TradeInEstimator";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Matériel informatique — Neuf, occasion & reprise",
  description:
    "Achat de matériel informatique neuf et d'occasion, reprise de votre ancien équipement. VoisinTech, Toulouse et Lourdes.",
  path: "/materiel",
});

const sections = [
  {
    id: "neuf",
    icon: Sparkles,
    title: "Matériel neuf",
    badge: "Bientôt",
    description:
      "Ordinateurs, écrans, accessoires sélectionnés pour seniors et familles. Conseil personnalisé avant achat — pas de catalogue impersonnel.",
    href: null,
  },
  {
    id: "occasion",
    icon: Recycle,
    title: "Occasion reconditionné",
    badge: "Bientôt",
    description:
      "PC et tablettes testés, nettoyés et garantis. Idéal pour un budget maîtrisé sans compromis sur la fiabilité.",
    href: null,
  },
  {
    id: "reprise",
    icon: ArrowRightLeft,
    title: "Reprise & rachat",
    badge: "Estimation en ligne",
    description:
      "Vous changez d'appareil ? Estimez la valeur de reprise en 30 secondes, puis demandez une offre ferme.",
    href: "#reprise",
  },
];

export default function MaterielPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-10 w-10 text-primary" aria-hidden="true" />
          <h1 className="text-4xl font-bold">Matériel</h1>
        </div>
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          Vente de matériel neuf et d&apos;occasion, plus un service de reprise pour
          recycler votre ancien équipement. Une seule page, trois options — sans
          surcharger le site.
        </p>

        <div className="grid gap-6 mb-12">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <article key={section.id} className="card">
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          section.badge === "Bientôt"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-success/15 text-success"
                        }`}
                      >
                        {section.badge === "Bientôt" && (
                          <Clock className="inline h-3 w-3 mr-1 -mt-0.5" aria-hidden="true" />
                        )}
                        {section.badge}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-3">{section.description}</p>
                    {section.href && (
                      <a href={section.href} className="text-primary font-medium text-sm hover:underline">
                        Voir l&apos;estimateur ↓
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section id="reprise" className="scroll-mt-24">
          <TradeInEstimator />
        </section>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Besoin d&apos;un conseil avant achat ? Je vous aide à choisir le bon matériel.
          </p>
          <Button asChild variant="outline">
            <Link href="/contact">
              Me contacter
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
