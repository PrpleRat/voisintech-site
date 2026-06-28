"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BosDashboardEmbedProps {
  url: string | null;
}

export function BosDashboardEmbed({ url }: BosDashboardEmbedProps) {
  if (!url) {
    return (
      <div className="section-padding min-h-[70vh]">
        <div className="container-page max-w-xl space-y-6">
          <div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/dashboard">← Retour admin</Link>
            </Button>
          </div>
          <div className="card space-y-4">
            <h1 className="text-2xl font-bold">BOS Dashboard</h1>
            <p className="text-gray-600 leading-relaxed">
              L&apos;URL de votre instance n&apos;est pas configurée. Ajoutez la variable{" "}
              <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">BOS_DASHBOARD_URL</code>{" "}
              sur Vercel (ou dans <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">.env</code>{" "}
              en local).
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Exemple : tunnel Cloudflare, Tailscale Funnel, ou URL de votre serveur maison. Le
              dashboard BOS (musique, photos, téléchargements) doit être accessible depuis le
              navigateur qui ouvre voisintech.fr.
            </p>
            <p className="text-sm text-gray-500">
              Projet source : <code className="text-xs">BOS-Dashboard/</code> dans le monorepo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
        <Button asChild variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
          <Link href="/admin/dashboard">← Admin</Link>
        </Button>
        <span className="text-sm font-semibold text-white">BOS Dashboard</span>
        <Button asChild variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Plein écran
            <ExternalLink className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </header>
      <iframe
        src={url}
        title="BOS Dashboard"
        className="min-h-0 flex-1 w-full border-0"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
