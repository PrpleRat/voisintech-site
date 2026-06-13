import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  showSlogan?: boolean;
  priority?: boolean;
}

export function BrandLogo({
  href = "/",
  className,
  imageClassName,
  showSlogan = false,
  priority = false,
}: BrandLogoProps) {
  const content = (
    <>
      <Image
        src="/logo.png"
        alt="VoisinTech — Dépannage informatique à domicile"
        width={180}
        height={72}
        priority={priority}
        className={cn("h-14 w-auto object-contain", imageClassName)}
      />
      {showSlogan && (
        <span className="text-sm text-gray-600 hidden sm:block mt-1">
          Votre voisin de confiance pour le numérique
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg",
          className
        )}
      >
        {content}
      </Link>
    );
  }

  return <div className={cn("flex flex-col", className)}>{content}</div>;
}
