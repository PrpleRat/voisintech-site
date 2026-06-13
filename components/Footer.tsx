import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { business } from "@/config/content";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/devis", label: "Devis gratuit" },
  { href: "/villes", label: "Villes desservies" },
  { href: "/blog", label: "Blog & FAQ" },
  { href: "/avis", label: "Avis clients" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-confidentialite", label: "Politique de confidentialité" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container-page section-padding">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold mb-2">{business.name}</h2>
            <p className="text-accent/90 mb-4">{business.slogan}</p>
            <p className="text-white/80 text-base leading-relaxed">
              Dépannage informatique, formation et assistance numérique à domicile
              à {business.city} et environs ({business.serviceRadius}).
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg font-bold hover:text-accent transition-colors min-h-[44px]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  WhatsApp — {business.phone}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${business.phoneRaw}`}
                  className="flex items-center gap-3 hover:text-accent transition-colors min-h-[44px]"
                >
                  <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {business.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-3 hover:text-accent transition-colors min-h-[44px]"
                >
                  <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {business.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <MapPin className="h-5 w-5 shrink-0 mt-1" aria-hidden="true" />
                <span>{business.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-accent transition-colors min-h-[44px] inline-flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 text-center text-white/70 text-sm">
          <p>© {new Date().getFullYear()} {business.name} — Tous droits réservés</p>
          <p className="mt-1">RC Pro assurée — SIRET : {business.siret}</p>
        </div>
      </div>
    </footer>
  );
}
