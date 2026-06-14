import type { Metadata } from "next";
import { business } from "@/config/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales",
  description: `Mentions légales du site ${business.name} (voisintech.fr) — dépannage informatique à Toulouse.`,
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-3xl prose prose-lg">
        <h1 className="text-4xl font-bold mb-8">Mentions légales</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Éditeur du site</h2>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Raison sociale :</strong> {business.name}</li>
            <li><strong>Forme juridique :</strong> Entrepreneur individuel</li>
            <li><strong>SIRET :</strong> {business.siret}</li>
            <li><strong>Adresse :</strong> {business.address}</li>
            <li><strong>Téléphone :</strong> {business.phone}</li>
            <li><strong>Email :</strong> {business.email}</li>
            <li><strong>Directeur de publication :</strong> {business.name}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Hébergement</h2>
          <p className="text-gray-700 leading-relaxed">
            Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Propriété intellectuelle</h2>
          <p className="text-gray-700 leading-relaxed">
            L&apos;ensemble du contenu de ce site (textes, images, logos) est la propriété de {business.name}
            et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
            Toute reproduction est interdite sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Responsabilité</h2>
          <p className="text-gray-700 leading-relaxed">
            {business.name} s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées sur ce site.
            Toutefois, {business.name} ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité
            des informations mises à disposition.
          </p>
        </section>
      </div>
    </div>
  );
}
