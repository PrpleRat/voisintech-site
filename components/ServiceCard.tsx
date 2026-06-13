import Link from "next/link";
import {
  Monitor,
  Smartphone,
  Wifi,
  Shield,
  FileText,
  GraduationCap,
  LucideIcon,
} from "lucide-react";
import { Service } from "@/config/content";

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Smartphone,
  Wifi,
  Shield,
  FileText,
  GraduationCap,
};

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Monitor;

  return (
    <article className="card hover:shadow-soft transition-shadow group">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
        <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{service.shortDescription}</p>
      <p className="text-primary font-semibold mb-4">{service.price}</p>
      <Link
        href={`/devis?service=${service.id}`}
        className="text-primary font-semibold hover:underline inline-flex items-center min-h-[44px]"
      >
        Demander ce service →
      </Link>
    </article>
  );
}
