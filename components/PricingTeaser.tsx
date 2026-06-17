import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { maintenancePlans, pricing } from "@/config/content";
import { Button } from "@/components/ui/button";

export function PricingTeaser() {
  return (
    <section
      className="section-padding bg-white border-y border-primary/10"
      aria-labelledby="tarifs-teaser-heading"
    >
      <div className="container-page">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 id="tarifs-teaser-heading" className="text-3xl font-extrabold md:text-4xl">
            Tarifs lisibles — pensés pour les seniors
          </h2>
          <p className="mt-4 text-xl text-gray-700 leading-relaxed md:text-2xl">
            Gros caractères, prix annoncés à l&apos;avance, contrats de maintenance pour être tranquille toute l&apos;année.
          </p>
        </div>

        <div
          className="pricing-senior-banner max-w-3xl mx-auto mb-10"
          role="note"
          aria-label="Tarif senior"
        >
          <div className="pricing-senior-icon" aria-hidden="true">
            <Heart className="h-10 w-10" strokeWidth={2.25} />
          </div>
          <div className="pricing-senior-copy text-left">
            <p className="pricing-senior-kicker">65 ans et plus</p>
            <p className="pricing-senior-title">{pricing.seniorHighlight.title}</p>
            <p className="pricing-senior-price">
              <span className="pricing-senior-amount">{pricing.seniorHighlight.price}</span>
              <span className="pricing-senior-vs">
                au lieu de {pricing.seniorHighlight.standardPrice}
              </span>
            </p>
          </div>
        </div>

        <ul className="pricing-grid pricing-grid-3 max-w-5xl mx-auto mb-10">
          {maintenancePlans.map((plan) => (
            <li key={plan.id} className="pricing-grid-item">
              <article className="pricing-card text-center">
                <h3 className="pricing-card-title-plan">{plan.name}</h3>
                <p className="pricing-price" aria-label={`${plan.monthlyPrice} par mois`}>
                  {plan.monthlyPrice}
                </p>
                <p className="pricing-unit">par mois</p>
                <p className="pricing-card-desc mt-3">
                  {plan.includedVisits} visite{plan.includedVisits > 1 ? "s" : ""}/an · priorité {plan.responseSLAHours} h
                </p>
              </article>
            </li>
          ))}
        </ul>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/services#tarifs">
              Voir toute la grille tarifaire
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
