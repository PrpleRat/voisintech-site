"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";
import { business } from "@/config/content";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { CallButton } from "@/components/CallButton";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useRegion } from "@/components/RegionProvider";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { config } = useRegion();

  const content = (
    <section className="py-8 md:py-12 lg:py-14 bg-gradient-to-br from-background via-white to-accent/20">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div>
            <p className="text-success font-semibold text-lg mb-3">
              {config.heroBadge}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              Votre voisin de confiance pour le numérique
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-xl">
              PC lent, smartphone compliqué, Wi-Fi capricieux ou démarches en ligne ?
              Je viens chez vous, je répare, et j&apos;explique tout simplement —
              sans jargon, avec patience.
            </p>
            <div className="flex flex-col gap-3 max-w-md">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/devis">
                  Demander un devis gratuit
                  <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </Link>
              </Button>
              <CallButton className="w-full sm:w-auto" />
              <WhatsAppButton className="w-full sm:w-auto" />
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/services">Voir les tarifs</Link>
              </Button>
            </div>
            <p className="mt-6 text-base text-gray-600">
              Ou contactez-nous :{" "}
              <a href={`tel:${business.phoneRaw}`} className="phone-link">
                {business.phone}
              </a>
              {" · "}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#128C7E] font-bold hover:underline focus-visible:underline"
              >
                WhatsApp
              </a>
            </p>
          </div>

          <div
            className="hidden sm:flex relative rounded-3xl bg-primary/10 lg:min-h-[280px] items-center justify-center overflow-hidden"
            role="img"
            aria-label="Technicien VoisinTech aidant un client à domicile"
          >
            <div className="text-center p-6 lg:p-8">
              <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Phone className="h-10 w-10 lg:h-12 lg:w-12 text-primary" aria-hidden="true" />
              </div>
              <p className="text-lg lg:text-xl font-semibold text-primary">
                Intervention à domicile
              </p>
              <p className="text-gray-600 mt-2">
                {config.hubCity} et {config.serviceRadius}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (reduceMotion) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {content}
    </motion.div>
  );
}
