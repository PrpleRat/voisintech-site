"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { suiteActivities, suiteApps, suiteBrand } from "@/config/train-suite";

interface BetaSignup {
  id: string;
  name: string;
  email: string;
  phone: string;
  activity: string;
  appsInterested: string;
  message: string;
  status: string;
  createdAt: string;
}

const activityLabels = Object.fromEntries(
  suiteActivities.map((a) => [a.value, a.label])
);

const appLabels = Object.fromEntries(
  suiteApps.map((a) => [a.id, a.marketingName])
);

function formatApps(json: string) {
  try {
    const ids = JSON.parse(json) as string[];
    return ids.map((id) => appLabels[id] || id).join(", ");
  } catch {
    return json;
  }
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "new"
      ? "bg-accent text-primary"
      : status === "invited"
        ? "bg-yellow-100 text-yellow-800"
        : status === "installed"
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-700";
  const label =
    status === "new"
      ? "Nouveau"
      : status === "invited"
        ? "Invité TestFlight"
        : status === "installed"
          ? "Installé"
          : status === "rejected"
            ? "Refusé"
            : status;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
      {label}
    </span>
  );
}

export function BetaSuiteTrainPanel() {
  const [signups, setSignups] = useState<BetaSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "invited" | "installed">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/beta-suite");
      if (!res.ok) throw new Error("load failed");
      const data = await res.json();
      setSignups(data.signups || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/beta-suite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-status", id, status }),
    });
    load();
  };

  const deleteSignup = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer l'inscription de ${name} ?`)) return;
    setDeletingId(id);
    try {
      await fetch("/api/admin/beta-suite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = signups.filter((s) => filter === "all" || s.status === filter);
  const newCount = signups.filter((s) => s.status === "new").length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card bg-primary/5 border border-primary/15">
        <h2 className="text-xl font-bold mb-2">Beta {suiteBrand.name} — inscriptions iOS</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Liste des inscriptions depuis{" "}
          <a href="/train-suite" className="text-primary font-semibold hover:underline" target="_blank" rel="noreferrer">
            voisintech.fr/train-suite
          </a>
          . Marquez « Invité TestFlight » après envoi du lien Apple.{" "}
          <strong>{newCount}</strong> nouvelle{newCount > 1 ? "s" : ""} en attente.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { value: "all", label: `Tous (${signups.length})` },
            { value: "new", label: "Nouveaux" },
            { value: "invited", label: "Invités" },
            { value: "installed", label: "Installés" },
          ] as const
        ).map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={filter === f.value ? "default" : "outline"}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((signup) => (
          <article key={signup.id} className="card">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="text-lg font-bold">{signup.name}</h3>
              <StatusBadge status={signup.status} />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(signup.createdAt).toLocaleString("fr-FR")}
              {signup.activity
                ? ` — ${activityLabels[signup.activity] || signup.activity}`
                : ""}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-base mb-4">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <a href={`mailto:${signup.email}`} className="text-primary font-semibold break-all hover:underline">
                  {signup.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <a href={`tel:${signup.phone}`} className="text-primary font-semibold hover:underline">
                  {signup.phone}
                </a>
              </p>
            </div>

            <p className="text-sm mb-2">
              <span className="font-semibold text-primary">Apps :</span>{" "}
              {formatApps(signup.appsInterested)}
            </p>

            {signup.message && (
              <p className="text-gray-700 bg-background rounded-xl p-4 text-sm leading-relaxed mb-4">
                {signup.message}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {signup.status === "new" && (
                <Button size="sm" onClick={() => updateStatus(signup.id, "invited")}>
                  Marquer invité TestFlight
                </Button>
              )}
              {signup.status === "invited" && (
                <Button size="sm" variant="outline" onClick={() => updateStatus(signup.id, "installed")}>
                  Marquer installé
                </Button>
              )}
              <Button size="sm" variant="outline" asChild>
                <a href={`mailto:${signup.email}?subject=Votre accès beta ${suiteBrand.name} (TestFlight)`}>
                  Envoyer email
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={`sms:${signup.phone}`}>SMS</a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                disabled={deletingId === signup.id}
                onClick={() => deleteSignup(signup.id, signup.name)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Supprimer
              </Button>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">Aucune inscription beta</p>
        )}
      </div>
    </div>
  );
}
