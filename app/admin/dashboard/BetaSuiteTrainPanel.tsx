"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { suiteActivities, suiteApps, suiteBrand } from "@/config/train-suite";
import type { TestFlightLinks } from "@/config/testflight";
import {
  buildInviteEmail,
  buildInviteSms,
  buildSmsHref,
} from "@/lib/testflight-invite";

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

interface TestFlightStatus {
  links: TestFlightLinks;
  allConfigured: boolean;
  missing: string[];
  configured: Array<{ id: string; name: string; url: string }>;
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
  const [testflight, setTestflight] = useState<TestFlightStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "invited" | "installed">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/beta-suite");
      if (!res.ok) throw new Error("load failed");
      const data = await res.json();
      setSignups(data.signups || []);
      setTestflight(data.testflight || null);
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

  const inviteSignup = async (signup: BetaSignup) => {
    if (!testflight?.links) return;
    const { mailto } = buildInviteEmail(signup, signup.appsInterested, testflight.links);
    window.open(mailto, "_self");
    if (signup.status === "new") {
      await updateStatus(signup.id, "invited");
    }
  };

  const copyInviteMessage = async (signup: BetaSignup) => {
    if (!testflight?.links) return;
    const { body } = buildInviteEmail(signup, signup.appsInterested, testflight.links);
    await navigator.clipboard.writeText(body);
    setCopiedId(signup.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = signups.filter((s) => filter === "all" || s.status === filter);
  const newCount = signups.filter((s) => s.status === "new").length;
  const linksReady = testflight?.allConfigured ?? false;

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
          . Utilisez « Inviter » pour envoyer l&apos;email TestFlight pré-rempli.{" "}
          <strong>{newCount}</strong> nouvelle{newCount > 1 ? "s" : ""} en attente.
        </p>
      </div>

      {testflight && (
        <div
          className={`card border ${
            linksReady ? "border-green-200 bg-green-50/50" : "border-amber-200 bg-amber-50/50"
          }`}
        >
          <div className="flex items-start gap-3">
            {linksReady ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="space-y-3 flex-1 min-w-0">
              <p className="font-semibold text-sm">
                {linksReady
                  ? "Liens TestFlight configurés"
                  : "Liens TestFlight manquants — les emails ne contiendront pas toutes les URLs"}
              </p>
              {!linksReady && testflight.missing.length > 0 && (
                <p className="text-sm text-amber-800">
                  À définir sur Vercel :{" "}
                  {testflight.missing.join(", ")}
                </p>
              )}
              {testflight.configured.length > 0 && (
                <ul className="text-sm space-y-1">
                  {testflight.configured.map((link) => (
                    <li key={link.id} className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{link.name}</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1 break-all"
                      >
                        {link.url}
                        <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

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
        {filtered.map((signup) => {
          const smsMessage =
            testflight?.links
              ? buildInviteSms(signup, signup.appsInterested, testflight.links)
              : "";
          const smsHref = smsMessage ? buildSmsHref(signup.phone, smsMessage) : `sms:${signup.phone}`;

          return (
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
                <Button
                  size="sm"
                  onClick={() => inviteSignup(signup)}
                  disabled={!testflight?.links || testflight.configured.length === 0}
                >
                  <Mail className="h-4 w-4 mr-1" aria-hidden="true" />
                  Inviter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyInviteMessage(signup)}
                  disabled={!testflight?.links || testflight.configured.length === 0}
                >
                  <Copy className="h-4 w-4 mr-1" aria-hidden="true" />
                  {copiedId === signup.id ? "Copié !" : "Copier le message"}
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={smsHref}>SMS</a>
                </Button>
                {signup.status === "invited" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(signup.id, "installed")}>
                    Marquer installé
                  </Button>
                )}
                {signup.status === "new" && (
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(signup.id, "invited")}>
                    Marquer invité (sans email)
                  </Button>
                )}
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
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">Aucune inscription beta</p>
        )}
      </div>
    </div>
  );
}
