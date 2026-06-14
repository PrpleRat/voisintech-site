import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialCarousel } from "@/components/TestimonialCard";
import { ServiceAreaMap } from "@/components/ServiceAreaMap";
import { services, howItWorks, trustBadges, business } from "@/config/content";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  Shield,
  Heart,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "VoisinTech — Dépannage informatique à domicile Toulouse",
  description:
    "VoisinTech (voisintech.fr) : votre technicien de dépannage informatique à domicile à Toulouse. PC, Mac, smartphone, Wi-Fi. Devis gratuit — 05 82 95 06 42.",
  path: "/",
});

const badgeIcons = [BadgeCheck, Shield, Heart, MessageCircle];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container-page max-w-4xl">
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>VoisinTech</strong> (<a href="https://www.voisintech.fr" className="text-primary hover:underline">voisintech.fr</a>) est
            votre spécialiste du{" "}
            <Link href="/villes/toulouse" className="text-primary font-semibold hover:underline">
              dépannage informatique à Toulouse
            </Link>
            {" "}et en agglomération. Réparation ordinateur, configuration smartphone,
            dépannage Wi-Fi et aide aux démarches en ligne — à domicile, sans jargon.
            Appelez le{" "}
            <a href={`tel:${business.phoneRaw}`} className="phone-link">
              {business.phone}
            </a>
            {" "}ou demandez un devis gratuit en ligne.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-center mb-4">Comment ça marche ?</h2>
          <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
            Simple comme un coup de fil à un voisin de confiance.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-center mb-4">Mes services</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Tout ce dont vous avez besoin pour le numérique, à domicile.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link href="/services">Voir tous les services et tarifs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary/5">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi VoisinTech ?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => {
              const Icon = badgeIcons[i] || BadgeCheck;
              return (
                <div key={badge.title} className="card text-center">
                  <Icon className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                  <h3 className="font-bold text-lg mb-1">{badge.title}</h3>
                  <p className="text-gray-600 text-sm">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TestimonialCarousel />
      <ServiceAreaMap className="pt-0" />

      <section className="section-padding bg-primary text-white">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold mb-4">
            Dépannage informatique à Toulouse — devis gratuit
          </h2>
          <p className="text-lg text-white/90 mb-4 max-w-xl mx-auto">
            PC lent, virus, Wi-Fi ou smartphone ? VoisinTech intervient chez vous
            à Toulouse et environs. Intervention rapide, explications claires.
          </p>
          <p className="text-white/80 mb-8">
            <Link href="/villes/toulouse" className="underline hover:text-white">
              Dépannage informatique Toulouse
            </Link>
            {" · "}
            <Link href="/services" className="underline hover:text-white">
              Tarifs
            </Link>
            {" · "}
            <Link href="/avis" className="underline hover:text-white">
              Avis clients
            </Link>
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/devis">Demander un devis gratuit</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
