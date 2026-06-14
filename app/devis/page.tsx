import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteForm } from "@/components/QuoteForm";
import { business } from "@/config/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Devis gratuit — Dépannage informatique Toulouse",
  description:
    "Demandez un devis gratuit VoisinTech pour votre dépannage informatique à domicile à Toulouse. Formulaire simple, réponse sous 2 heures.",
  path: "/devis",
});

export default function DevisPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">
          Devis gratuit — dépannage informatique à Toulouse
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Décrivez votre problème en 3 étapes simples. Je vous recontacte dans les{" "}
          <strong>2 heures</strong> en journée. Ou appelez directement le{" "}
          <a href={`tel:${business.phoneRaw}`} className="phone-link">
            {business.phone}
          </a>
          .
        </p>

        <div className="card">
          <Suspense fallback={<p>Chargement du formulaire...</p>}>
            <QuoteForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
