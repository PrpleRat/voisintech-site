import { Phone } from "lucide-react";
import { business } from "@/config/content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CallButtonProps {
  size?: "default" | "sm" | "lg";
  className?: string;
  variant?: "success" | "outline";
  /** Label court sans numéro — pour header et espaces étroits */
  compact?: boolean;
}

export function CallButton({
  size = "lg",
  className,
  variant = "success",
  compact = false,
}: CallButtonProps) {
  const label = compact ? "Appeler" : `Appeler ${business.phone}`;

  return (
    <Button
      asChild
      size={size}
      className={cn(
        variant === "success" && "bg-success hover:bg-success/90 text-white",
        className
      )}
      variant={variant === "outline" ? "outline" : "default"}
    >
      <a
        href={`tel:${business.phoneRaw}`}
        aria-label={`Appeler le ${business.phone}`}
      >
        <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
        {label}
      </a>
    </Button>
  );
}
