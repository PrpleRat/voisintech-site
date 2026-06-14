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
import { services, pricing } from "@/config/content";
import { Button } from "@/components/ui/button";
import { RegionPricingNote } from "@/components/RegionPricingNote";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Dépannage informatique Toulouse — Services & tarifs",
  description:
    "Services VoisinTech à Toulouse : dépannage PC/Mac, smartphones, Wi-Fi, sécurité, démarches en ligne. Tarifs transparents, devis gratuit à domicile.",
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
        <h1 className="text-4xl font-bold mb-4">
          Dépannage informatique à Toulouse — Services & tarifs
        </h1>
        <p className="text-lg text-gray-600 mb-4 max-w-3xl">
          VoisinTech intervient à domicile à Toulouse et en agglomération.
          Des tarifs clairs, affichés à l&apos;avance. Devis gratuit avant chaque intervention.
        </p>
        <p className="mb-12">
          <Link href="/villes/toulouse" className="text-primary font-semibold hover:underline">
            Voir la page dépannage informatique Toulouse →
          </Link>
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
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{service.title}</h2>
                    <p className="text-primary font-semibold mt-1">{service.price}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 max-w-3xl">
                  {service.description}
                </p>
                <Button asChild>
                  <Link href={`/devis?service=${service.id}`}>
                    Demander ce service
                  </Link>
                </Button>
              </section>
            );
          })}
        </div>

        <section className="mt-20" id="tarifs">
          <h2 className="text-3xl font-bold mb-8">Grille tarifaire</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Tarifs horaires</h3>
              <table className="w-full">
                <tbody>
                  {pricing.hourly.map((item) => (
                    <tr key={item.label} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 text-gray-700">{item.label}</td>
                      <td className="py-3 text-right font-bold text-primary whitespace-nowrap">
                        {item.price}
                        {item.note && (
                          <span className="block text-xs text-gray-500 font-normal">
                            {item.note}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4">Forfaits</h3>
              <table className="w-full">
                <tbody>
                  {pricing.packages.map((item) => (
                    <tr key={item.label} className="border-b border-gray-100 last:border-0">
                      <td className="py-3">
                        <span className="text-gray-700">{item.label}</span>
                        <span className="block text-sm text-gray-500">{item.description}</span>
                      </td>
                      <td className="py-3 text-right font-bold text-primary whitespace-nowrap">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <RegionPricingNote />
        </section>

        <div className="mt-16 text-center card bg-primary/5">
          <h2 className="text-2xl font-bold mb-4">Besoin d&apos;un devis personnalisé ?</h2>
          <p className="text-gray-600 mb-6">
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
