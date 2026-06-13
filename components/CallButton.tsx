import { Phone } from "lucide-react";
import { business } from "@/config/content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CallButtonProps {
  size?: "default" | "sm" | "lg";
  className?: string;
  variant?: "success" | "outline";
}

export function CallButton({
  size = "lg",
  className,
  variant = "success",
}: CallButtonProps) {
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
      <a href={`tel:${business.phoneRaw}`}>
        <Phone className="h-5 w-5" aria-hidden="true" />
        Appeler {business.phone}
      </a>
    </Button>
  );
}
