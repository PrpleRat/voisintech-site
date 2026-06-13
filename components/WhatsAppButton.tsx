import { business } from "@/config/content";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  size?: "default" | "sm" | "lg";
  className?: string;
  /** Message pré-rempli dans WhatsApp */
  message?: string;
  /** Label court sans mentionner le numéro */
  compact?: boolean;
}

export function WhatsAppButton({
  size = "lg",
  className,
  message,
  compact = false,
}: WhatsAppButtonProps) {
  const label = compact ? "WhatsApp" : `WhatsApp ${business.phone}`;

  return (
    <Button
      asChild
      size={size}
      className={cn(
        "bg-[#25D366] hover:bg-[#20BD5A] text-white border-transparent",
        className
      )}
    >
      <a
        href={getWhatsAppUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Contacter VoisinTech sur WhatsApp au ${business.phone}`}
      >
        <WhatsAppIcon />
        {label}
      </a>
    </Button>
  );
}
