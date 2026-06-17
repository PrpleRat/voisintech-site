import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Calculator,
  FileText,
  Users,
  Cloud,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { SuiteBetaForm } from "@/components/SuiteBetaForm";
import { trainSuiteApps, trainSuiteBrand } from "@/config/train-suite";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Train Suite — Beta iOS pour micro-entrepreneurs",
  description:
    "Inscrivez-vous à la beta iOS Train Suite : agenda, facturation, compta et CRM synchronisés pour les indépendants. TestFlight bientôt disponible.",
  path: "/train-suite",
});

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  FileText,
  Calculator,
  Users,
};

export default function TrainSuitePage() {
  return (
    <div className="section-padding">
      <div className="container-page">
        <header className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-success font-bold text-lg mb-3 uppercase tracking-wide">
            Beta iOS — places limitées
          </p>
          <h1 className="text-4xl font-extrabold mb-4 md:text-5xl">{trainSuiteBrand.name}</h1>
          <p className="text-xl text-primary font-semibold mb-4 md:text-2xl">
            {trainSuiteBrand.tagline}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed md:text-xl">
            {trainSuiteBrand.description}
          </p>
        </header>

        <section
          className="mb-14"
          aria-labelledby="suite-apps-heading"
        >
          <h2 id="suite-apps-heading" className="sr-only">
            Les quatre apps de la suite
          </h2>
          <ul className="pricing-grid pricing-grid-2 max-w-5xl mx-auto">
            {trainSuiteApps.map((app) => {
              const Icon = iconMap[app.icon] ?? Calendar;
              return (
                <li key={app.id} className="pricing-grid-item">
                  <article className="pricing-card h-full">
                    <div className="pricing-card-top">
                      <div className="pricing-card-icon" aria-hidden="true">
                        <Icon className="h-8 w-8" strokeWidth={2.25} />
                      </div>
                      <div>
                        <h3 className="pricing-card-title">{app.marketingName}</h3>
                        <p className="text-sm text-gray-500">
                          App actuelle : {app.currentName}
                        </p>
                      </div>
                    </div>
                    <p className="pricing-card-desc">{app.tagline}</p>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="grid lg:grid-cols-2 gap-10 items-start max-w-6xl mx-auto mb-14">
          <div className="space-y-6">
            <div className="card bg-primary/5 border-2 border-primary/15">
              <div className="flex items-start gap-4">
                <Cloud className="h-10 w-10 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <h2 className="text-2xl font-extrabold mb-2">Synchronisation cloud</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Clients, contrats maintenance, devis et factures partagés entre les apps.
                    Vous modifiez une fois — tout se met à jour.
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-start gap-4">
                <Smartphone className="h-10 w-10 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <h2 className="text-2xl font-extrabold mb-2">Comment fonctionne la beta ?</h2>
                  <ol className="text-lg text-gray-700 space-y-3 list-decimal pl-5">
                    <li>Vous remplissez le formulaire ci-contre.</li>
                    <li>On vous envoie un lien <strong>TestFlight</strong> (Apple).</li>
                    <li>Vous installez les apps et testez sur le terrain.</li>
                    <li>Vous nous dites ce qui coince — on améliore vite.</li>
                  </ol>
                </div>
              </div>
            </div>
            <p className="text-base text-gray-600">
              Développé par{" "}
              <Link href="/" className="text-primary font-semibold hover:underline">
                VoisinTech
              </Link>
              {" "}— d&apos;abord pour les dépanneurs et micro-entrepreneurs, ensuite pour tous les indés.
            </p>
          </div>

          <SuiteBetaForm />
        </section>

        <section className="max-w-3xl mx-auto card bg-success/10 border-2 border-success/30 text-center p-8">
          <h2 className="text-2xl font-extrabold mb-3">Déjà client VoisinTech ?</h2>
          <p className="text-lg text-gray-700 mb-4">
            Dites-le dans le message du formulaire — les utilisateurs du terrain passent en priorité.
          </p>
          <p className="text-base text-gray-600">{trainSuiteBrand.betaNote}</p>
        </section>
      </div>
    </div>
  );
}
