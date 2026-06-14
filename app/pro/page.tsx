import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  Globe,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Construction,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { business } from "@/config/content";

export const metadata: Metadata = {
  title: "Espace Pro — Sites web, URSSAF & outils métier",
  description:
    "Services professionnels VoisinTech : création de site web sur mesure, accompagnement URSSAF et solutions applicatives pour entrepreneurs.",
};

const services = [
  {
    id: "site-web",
    icon: Globe,
    title: "Site web sur mesure",
    status: "available" as const,
    description:
      "Vitrine, landing page ou site complet — design pro, formulaire de contact, SEO local. Idéal artisans, indépendants et TPE.",
    cta: { href: "/devis?service=site-web", label: "Demander un devis" },
  },
  {
    id: "urssaf",
    icon: FileSpreadsheet,
    title: "Accompagnement URSSAF & admin",
    status: "available" as const,
    description:
      "Déclarations URSSAF, facturation, premiers pas en micro-entreprise. Je vous guide pas à pas — sans jargon administratif.",
    cta: { href: "/devis?service=urssaf", label: "Demander un devis" },
  },
  {
    id: "train-suite",
    icon: Layers,
    title: "Suite Train — CRM, Agenda, Factu, CA",
    status: "construction" as const,
    description:
      "Quatre applications interconnectées pour gérer clients, planning, devis/factures et chiffre d'affaires. Bundle en cours de finalisation.",
    cta: null,
  },
];

export default function ProPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="h-10 w-10 text-primary" aria-hidden="true" />
          <h1 className="text-4xl font-bold">Espace Pro</h1>
        </div>
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          Au-delà du dépannage à domicile, VoisinTech accompagne les entrepreneurs et
          indépendants : site web, démarches URSSAF et bientôt une suite d&apos;outils
          métier complète.
        </p>

        <div className="space-y-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.id} className="card relative overflow-hidden">
                {service.status === "construction" && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-1">
                    <Construction className="h-3.5 w-3.5" aria-hidden="true" />
                    En construction
                  </span>
                )}
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>
                    {service.cta ? (
                      <Button asChild variant="outline">
                        <Link href={service.cta.href}>
                          {service.cta.label}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Disponible prochainement — contactez-nous pour être informé.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 card bg-primary/5 text-center">
          <p className="text-gray-700 mb-4">
            Un projet pro en tête ? Décrivez-le — réponse sous 2h en journée.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Nous contacter</Link>
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Ou appelez le{" "}
            <a href={`tel:${business.phoneRaw}`} className="text-primary font-semibold">
              {business.phone}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
