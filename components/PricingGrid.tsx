import Link from "next/link";
import {
  Clock,
  Home,
  Monitor,
  Phone,
  Shield,
  Sparkles,
  Heart,
  Check,
  type LucideIcon,
} from "lucide-react";
import { pricing, maintenancePlans } from "@/config/content";
import { Button } from "@/components/ui/button";
import { RegionPricingNote } from "@/components/RegionPricingNote";
import { cn } from "@/lib/utils";

const hourlyIcons: Record<string, LucideIcon> = {
  depannage: Home,
  formation: Monitor,
  distance: Phone,
};

const packageIcons: Record<string, LucideIcon> = {
  diagnostic: Monitor,
  remise: Sparkles,
  smartphone: Phone,
  securite: Shield,
};

function PricingFeatureList({ items }: { items: string[] }) {
  return (
    <ul className="pricing-features" aria-label="Ce qui est inclus">
      {items.map((feature) => (
        <li key={feature}>
          <Check className="pricing-feature-icon" aria-hidden="true" strokeWidth={3} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function PriceDisplay({
  price,
  unit,
  compareAt,
  id,
}: {
  price: string;
  unit?: string;
  compareAt?: string;
  id: string;
}) {
  return (
    <div className="pricing-price-block">
      {compareAt && (
        <p className="pricing-compare" aria-label={`Prix habituel : ${compareAt}`}>
          <span aria-hidden="true">au lieu de {compareAt}</span>
        </p>
      )}
      <p className="pricing-price" id={id} aria-label={`Prix : ${price}${unit ? ` ${unit}` : ""}`}>
        <span aria-hidden="true">{price}</span>
      </p>
      {unit && (
        <p className="pricing-unit" aria-hidden="true">
          {unit}
        </p>
      )}
    </div>
  );
}

export function PricingGrid() {
  return (
    <section
      id="tarifs"
      className="pricing-section scroll-mt-24"
      aria-labelledby="tarifs-heading"
    >
      <div className="pricing-senior-banner" role="note" aria-label="Tarif senior">
        <div className="pricing-senior-icon" aria-hidden="true">
          <Heart className="h-10 w-10" strokeWidth={2.25} />
        </div>
        <div className="pricing-senior-copy">
          <p className="pricing-senior-kicker">65 ans et plus</p>
          <h3 className="pricing-senior-title">{pricing.seniorHighlight.title}</h3>
          <p className="pricing-senior-price" aria-label="Tarif senior quarante euros de l'heure">
            <span className="pricing-senior-amount" aria-hidden="true">
              {pricing.seniorHighlight.price}
            </span>
            <span className="pricing-senior-vs" aria-hidden="true">
              au lieu de {pricing.seniorHighlight.standardPrice}
            </span>
          </p>
          <p className="pricing-senior-desc">{pricing.seniorHighlight.description}</p>
        </div>
      </div>

      <header className="pricing-header">
        <h2 id="tarifs-heading" className="pricing-main-title">
          Nos tarifs — clairs et sans surprise
        </h2>
        <p className="pricing-main-lead">
          Tous les prix sont affichés à l&apos;avance. Devis gratuit avant chaque intervention.
          Pas de jargon, pas de facture surprise.
        </p>
      </header>

      <div className="pricing-category">
        <div className="pricing-category-head">
          <Clock className="pricing-category-icon" aria-hidden="true" />
          <h3 id="tarifs-horaires" className="pricing-category-title">
            Tarifs à l&apos;heure
          </h3>
        </div>
        <ul
          className="pricing-grid pricing-grid-3"
          aria-labelledby="tarifs-horaires"
        >
          {pricing.hourly.map((item) => {
            const Icon = hourlyIcons[item.id] ?? Clock;
            const titleId = `tarif-${item.id}`;
            return (
              <li key={item.id} className="pricing-grid-item">
                <article className="pricing-card" aria-labelledby={titleId}>
                  <div className="pricing-card-top">
                    <div className="pricing-card-icon" aria-hidden="true">
                      <Icon className="h-8 w-8" strokeWidth={2.25} />
                    </div>
                    <h4 id={titleId} className="pricing-card-title">
                      {item.label}
                    </h4>
                  </div>
                  <PriceDisplay price={item.price} id={`${titleId}-price`} />
                  {item.note && (
                    <p className="pricing-card-note">
                      <strong>{item.note}</strong>
                    </p>
                  )}
                  <p className="pricing-card-desc">{item.description}</p>
                  <PricingFeatureList items={item.features} />
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pricing-category">
        <div className="pricing-category-head">
          <Sparkles className="pricing-category-icon" aria-hidden="true" />
          <h3 id="tarifs-forfaits" className="pricing-category-title">
            Forfaits tout compris
          </h3>
        </div>
        <ul
          className="pricing-grid pricing-grid-2"
          aria-labelledby="tarifs-forfaits"
        >
          {pricing.packages.map((item) => {
            const Icon = packageIcons[item.id] ?? Sparkles;
            const titleId = `forfait-${item.id}`;
            return (
              <li key={item.id} className="pricing-grid-item">
                <article className="pricing-card" aria-labelledby={titleId}>
                  <div className="pricing-card-top">
                    <div className="pricing-card-icon" aria-hidden="true">
                      <Icon className="h-8 w-8" strokeWidth={2.25} />
                    </div>
                    <h4 id={titleId} className="pricing-card-title">
                      {item.label}
                    </h4>
                  </div>
                  <PriceDisplay price={item.price} id={`${titleId}-price`} />
                  <p className="pricing-card-desc">{item.description}</p>
                  <PricingFeatureList items={item.features} />
                  <div className="pricing-card-cta">
                    <Button asChild size="lg" variant="outline" className="w-full">
                      <Link href={`/devis?service=${item.id === "securite" ? "securite" : item.id === "smartphone" ? "smartphone" : "depannage"}`}>
                        Demander ce forfait
                      </Link>
                    </Button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pricing-category pricing-category-maintenance">
        <div className="pricing-category-head">
          <Shield className="pricing-category-icon" aria-hidden="true" />
          <div>
            <h3 id="contrats-maintenance" className="pricing-category-title">
              Contrats de maintenance
            </h3>
            <p className="pricing-category-subtitle">
              Tranquillité toute l&apos;année — priorité garantie, visites incluses, sans engagement longue durée.
            </p>
          </div>
        </div>
        <ul
          className="pricing-grid pricing-grid-3"
          aria-labelledby="contrats-maintenance"
        >
          {maintenancePlans.map((plan) => {
            const titleId = `maintenance-${plan.id}`;
            return (
              <li key={plan.id} className="pricing-grid-item">
                <article
                  className={cn(
                    "pricing-card pricing-card-maintenance",
                    plan.highlighted && "pricing-card-featured"
                  )}
                  aria-labelledby={titleId}
                >
                  {plan.badge && (
                    <p className="pricing-badge" aria-label={`Formule recommandée : ${plan.badge}`}>
                      {plan.badge}
                    </p>
                  )}
                  <h4 id={titleId} className="pricing-card-title pricing-card-title-plan">
                    {plan.name}
                  </h4>
                  <PriceDisplay
                    price={plan.monthlyPrice}
                    unit="par mois"
                    id={`${titleId}-price`}
                  />
                  <p className="pricing-card-desc">{plan.description}</p>
                  <PricingFeatureList items={plan.features} />
                  <div className="pricing-card-cta">
                    <Button
                      asChild
                      size="lg"
                      variant={plan.highlighted ? "default" : "outline"}
                      className="w-full"
                    >
                      <Link href={`/devis?plan=${plan.id}`}>
                        Choisir {plan.name}
                      </Link>
                    </Button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      <RegionPricingNote />

      <p className="pricing-footnote">
        <strong>Besoin d&apos;aide pour choisir ?</strong> Appelez le{" "}
        <a href="tel:0582950642" className="phone-link">
          05 82 95 06 42
        </a>
        {" "}— on vous guide sans pression.
      </p>
    </section>
  );
}
