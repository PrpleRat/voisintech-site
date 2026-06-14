"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { business } from "@/config/content";
import { Button } from "@/components/ui/button";
import { CallButton } from "@/components/CallButton";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { RegionSwitcher } from "@/components/RegionSwitcher";
import { useRegion } from "@/components/RegionProvider";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services & Tarifs" },
  { href: "/devis", label: "Demander un devis" },
  { href: "/villes", label: "Villes" },
  { href: "/blog", label: "Blog & FAQ" },
  { href: "/avis", label: "Avis clients" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

const desktopNavLinks = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/devis", label: "Devis" },
  { href: "/villes", label: "Villes" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { config } = useRegion();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-primary/10 shadow-sm">
      <div className="bg-primary text-white py-2">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm sm:text-base">
          <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Besoin d&apos;aide ?</span>
          <a
            href={`tel:${business.phoneRaw}`}
            className="font-bold underline hover:no-underline focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            {business.phone}
          </a>
          <span className="hidden sm:inline text-white/80">·</span>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline hover:no-underline focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className="container-page flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        >
          <span className="text-2xl font-bold text-primary">{business.name}</span>
          <span className="text-sm text-gray-600 hidden sm:block">
            {business.slogan} — {config.hubCity}
          </span>
        </Link>

        <nav
          className="hidden xl:flex items-center gap-3 shrink-0"
          aria-label="Navigation principale"
        >
          <RegionSwitcher className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-colors rounded-lg px-2 py-1 border border-primary/15 bg-primary/5 min-h-[36px]" />
          {desktopNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-1">
            <Link href="/devis">Devis gratuit</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="xl:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-primary/20 text-primary"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <nav
        id="mobile-menu"
        className={cn(
          "xl:hidden border-t border-primary/10 bg-white",
          open ? "block" : "hidden"
        )}
        aria-label="Navigation mobile"
      >
        <div className="container-page py-4 flex flex-col gap-2">
          <RegionSwitcher className="flex items-center gap-2 text-sm font-medium text-primary py-2 px-2" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium py-3 px-2 rounded-xl hover:bg-primary/5 min-h-[44px] flex items-center"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <CallButton className="mt-2 w-full" />
          <WhatsAppButton className="w-full" />
          <Button asChild className="mt-2">
            <Link href="/devis" onClick={() => setOpen(false)}>
              Demander un devis gratuit
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
