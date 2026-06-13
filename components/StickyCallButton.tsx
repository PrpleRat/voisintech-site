import { Phone } from "lucide-react";
import { business } from "@/config/content";

export function StickyCallButton() {
  return (
    <a
      href={`tel:${business.phoneRaw}`}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-success text-white px-5 py-4 rounded-full shadow-lg font-bold text-base min-h-[44px] hover:bg-success/90 transition-colors focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2"
      aria-label={`Appeler VoisinTech au ${business.phone}`}
    >
      <Phone className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">Appeler</span>
      <span className="sm:hidden">{business.phone}</span>
    </a>
  );
}
