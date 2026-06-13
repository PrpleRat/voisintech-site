import type { Metadata } from "next";
import { Phone, Mail } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { FAQAccordion } from "@/components/FAQAccordion";
import { business, faq } from "@/config/content";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez VoisinTech pour un dépannage informatique à domicile à Toulouse. Téléphone, email ou formulaire de contact.",
};

export default function ContactPage() {
  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="text-4xl font-bold mb-4">Contactez-moi</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl">
          Une question, un problème urgent ? Je suis joignable par téléphone,
          email ou via le formulaire ci-dessous. Réponse sous 2 heures en journée.
        </p>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="space-y-6 mb-8">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href={`tel:${business.phoneRaw}`}>
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  {business.phone}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <a href={`mailto:${business.email}`}>
                  <Mail className="h-5 w-5" aria-hidden="true" />
                  {business.email}
                </a>
              </Button>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-soft border border-primary/10">
              <iframe
                title="Carte — VoisinTech Toulouse"
                src="https://www.openstreetmap.org/export/embed.html?bbox=1.25%2C43.48%2C1.58%2C43.72&layer=mapnik&marker=43.6047%2C1.4442"
                className="w-full h-[300px] border-0"
                loading="lazy"
              />
            </div>
          </div>

          <ContactForm />
        </div>

        <section>
          <h2 className="text-3xl font-bold mb-8">Questions fréquentes</h2>
          <FAQAccordion items={faq} />
        </section>
      </div>
    </div>
  );
}
