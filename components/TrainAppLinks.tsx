"use client";

import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrainAppAction } from "@/lib/train-deeplinks";

interface TrainAppLinksProps {
  title?: string;
  actions: TrainAppAction[];
  hint?: string;
}

export function TrainAppLinks({
  title = "Apps Train",
  actions,
  hint = "Ouvre l'app sur iPhone (apps installées). Sur ordinateur, copiez le lien ou scannez depuis le téléphone.",
}: TrainAppLinksProps) {
  if (actions.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Smartphone className="h-4 w-4 shrink-0" aria-hidden="true" />
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button key={action.id} size="sm" variant={action.variant ?? "outline"} asChild>
            <a href={action.href} title={action.description}>
              {action.label}
            </a>
          </Button>
        ))}
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{hint}</p>
    </div>
  );
}
