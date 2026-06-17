import type { Metadata } from "next";
import Link from "next/link";
import {
  Monitor,
  Smartphone,
  Wifi,
  Shield,
  FileText,
  GraduationCap,
  LucideIcon,
} from "lucide-react";
import { services } from "@/config/content";
import { Button } from "@/components/ui/button";
import { PricingGrid } from "@/components/PricingGrid";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Dépannage informatique Toulouse — Services & tarifs",
  description:
    "Services VoisinTech à Toulouse : dépannage PC/Mac, smartphones, Wi-Fi, sécurité. Tarifs transparents, contrats maintenance dès 9€/mois, tarif senior 40€/h. Devis gratuit.",
  path: "/services",
});

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Smartphone,
  Wifi,
  Shield,
  FileText,
  GraduationCap,
};

export default function ServicesPage() {
  return (
    <div className="section-padding">
      <div className="container-page">
        <header className="mb-10 max-w-4xl">
          <h1 className="text-4xl font-extrabold mb-4 md:text-5xl">
            Dépannage informatique à Toulouse — Services &amp; tarifs
          </h1>
          <p className="text-xl text-gray-700 mb-4 leading-relaxed md:text-2xl">
            VoisinTech intervient à domicile à Toulouse et en agglomération.
            Des tarifs clairs, affichés à l&apos;avance. Devis gratuit avant chaque intervention.
          </p>
          <p className="text-lg">
            <Link
              href="/villes/toulouse"
              className="text-primary font-bold text-xl hover:underline focus-visible:underline"
            >
              Voir la page dépannage informatique Toulouse →
            </Link>
          </p>
        </header>

        <PricingGrid />

        <section className="mt-20" aria-labelledby="services-detail-heading">
          <h2 id="services-detail-heading" className="text-3xl font-extrabold mb-4 md:text-4xl">
            Détail des services
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl leading-relaxed">
            Chaque intervention est expliquée en français simple, avec patience.
          </p>

          <div className="space-y-16">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Monitor;
              return (
                <section
                  key={service.id}
                  id={service.id}
                  className="scroll-mt-24"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold md:text-3xl">{service.title}</h3>
                      <p className="text-primary font-bold text-xl mt-1">{service.price}</p>
                    </div>
                  </div>
                  <p className="text-gray-800 text-lg leading-relaxed mb-6 max-w-3xl md:text-xl">
                    {service.description}
                  </p>
                  <Button asChild size="lg">
                    <Link href={`/devis?service=${service.id}`}>
                      Demander ce service
                    </Link>
                  </Button>
                </section>
              );
            })}
          </div>
        </section>

        <div className="mt-16 text-center card bg-primary/5 p-8 md:p-10">
          <h2 className="text-2xl font-extrabold mb-4 md:text-3xl">
            Besoin d&apos;un devis personnalisé ?
          </h2>
          <p className="text-gray-700 text-lg mb-6 md:text-xl">
            Décrivez votre problème, c&apos;est gratuit et sans engagement.
          </p>
          <Button asChild size="lg">
            <Link href="/devis">Demander un devis gratuit</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
