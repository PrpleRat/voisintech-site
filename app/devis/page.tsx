import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteForm } from "@/components/QuoteForm";
import { business } from "@/config/content";

export const metadata: Metadata = {
  title: "Demander un devis gratuit",
  description:
    "Demandez un devis gratuit pour votre dépannage informatique à domicile à Toulouse. Formulaire simple, réponse sous 2 heures.",
};

export default function DevisPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Demander un devis gratuit</h1>
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
