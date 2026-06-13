import { business } from "@/config/content";
import { cn } from "@/lib/utils";

interface ServiceAreaMapProps {
  className?: string;
}

export function ServiceAreaMap({ className }: ServiceAreaMapProps) {
  return (
    <section
      className={cn("section-padding bg-white", className)}
      aria-label="Zone d'intervention"
    >
      <div className="container-page">
        <h2 className="text-3xl font-bold text-center mb-4">Zone d&apos;intervention</h2>
        <p className="text-center text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
          J&apos;interviens à {business.city} et dans un rayon de {business.serviceRadius}.
          Déplacement gratuit jusqu&apos;à 15 km.
        </p>
        <div className="rounded-2xl overflow-hidden shadow-soft border border-primary/10">
          <iframe
            title="Carte de la zone d'intervention VoisinTech autour de Toulouse"
            src="https://www.openstreetmap.org/export/embed.html?bbox=1.25%2C43.48%2C1.58%2C43.72&layer=mapnik&marker=43.6047%2C1.4442"
            className="w-full h-[280px] md:h-[350px] border-0"
            loading="lazy"
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Toulouse, Blagnac, Colomiers, Tournefeuille, Balma, L&apos;Union et environs
        </p>
      </div>
    </section>
  );
}
