import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/config/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Politique de confidentialité",
  description: `Politique de confidentialité et protection des données personnelles — ${business.name} (voisintech.fr).`,
  path: "/politique-confidentialite",
});

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Politique de confidentialité</h1>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Responsable du traitement</h2>
            <p>
              {business.name} — {business.email} — {business.phone}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Données collectées</h2>
            <p className="mb-4">Nous collectons les données suivantes via nos formulaires :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nom, prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Adresse postale (formulaire de devis)</li>
              <li>Description du problème informatique</li>
              <li>Disponibilités pour rendez-vous</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Finalités du traitement</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Traitement de vos demandes de devis et de contact</li>
              <li>Prise de rendez-vous pour interventions à domicile</li>
              <li>Envoi de confirmations par email</li>
              <li>Publication d&apos;avis clients (avec votre consentement)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Base légale</h2>
            <p>
              Le traitement de vos données repose sur votre consentement (formulaires)
              et l&apos;exécution du contrat de prestation de services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Durée de conservation</h2>
            <p>
              Vos données sont conservées pendant 3 ans à compter du dernier contact,
              conformément aux obligations légales et commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Vos droits</h2>
            <p className="mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d&apos;opposition</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href={`mailto:${business.email}`} className="text-primary hover:underline">
                {business.email}
              </a>
              . Vous pouvez également introduire une réclamation auprès de la CNIL.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Cookies</h2>
            <p>
              Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement
              (session administrateur). Aucun cookie publicitaire ou de tracking n&apos;est utilisé.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques appropriées pour protéger vos données
              personnelles contre tout accès non autorisé, perte ou destruction.
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-4">
            Dernière mise à jour : juin 2026 —{" "}
            <Link href="/mentions-legales" className="text-primary hover:underline">
              Mentions légales
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
