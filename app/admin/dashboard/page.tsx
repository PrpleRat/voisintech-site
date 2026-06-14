"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Monitor,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrainAppLinks } from "@/components/TrainAppLinks";
import { contactTrainActions, quoteTrainActions } from "@/lib/train-deeplinks";

interface Quote {
  id: string;
  deviceType: string;
  problemDesc: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  preferredDays: string;
  preferredTime: string;
  preferredDate: string | null;
  status: string;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
}

interface Stats {
  quotesWeek: number;
  quotesMonth: number;
  contactsWeek: number;
  contactsMonth: number;
  proWeek: number;
  proMonth: number;
  pendingReviews: number;
}

interface ProRequest {
  id: string;
  serviceType: string;
  name: string;
  phone: string;
  email: string;
  company: string | null;
  city: string;
  details: string;
  status: string;
  createdAt: string;
}

const proServiceLabels: Record<string, string> = {
  "site-web": "Site web sur mesure",
  urssaf: "Accompagnement URSSAF",
};

function formatProDetails(json: string) {
  try {
    const d = JSON.parse(json) as Record<string, unknown>;
    if (d.siteType) {
      return [
        ["Type", d.siteType],
        ["Pages", d.pageCount],
        ["Budget", d.budget],
        ["Délai", d.deadline],
        ["Fonctionnalités", Array.isArray(d.features) ? (d.features as string[]).join(", ") : ""],
        ["Description", d.projectDesc],
      ] as [string, unknown][];
    }
    return [
      ["Statut", d.legalStatus],
      ["Secteur", d.sector],
      ["Besoins", Array.isArray(d.needs) ? (d.needs as string[]).join(", ") : ""],
      ["Urgence", d.urgency],
      ["Description", d.projectDesc],
    ] as [string, unknown][];
  } catch {
    return [["Détails", json]] as [string, unknown][];
  }
}

const timeLabels: Record<string, string> = {
  matin: "Matin (8h-12h)",
  "apres-midi": "Après-midi (12h-18h)",
  soir: "Soir (18h-20h)",
};

function formatPreferredDays(json: string) {
  try {
    const days = JSON.parse(json) as string[];
    const labels: Record<string, string> = {
      lundi: "Lundi",
      mardi: "Mardi",
      mercredi: "Mercredi",
      jeudi: "Jeudi",
      vendredi: "Vendredi",
      samedi: "Samedi",
      dimanche: "Dimanche",
    };
    return days.map((d) => labels[d] || d).join(", ");
  } catch {
    return json;
  }
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "new"
      ? "bg-accent text-primary"
      : status === "contacted"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-green-100 text-green-800";
  const label =
    status === "new" ? "Nouveau" : status === "contacted" ? "Contacté" : "Terminé";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
      {label}
    </span>
  );
}

function QuoteCard({
  quote,
  expanded,
  onToggle,
  onUpdateStatus,
  onDelete,
  deleting,
}: {
  quote: Quote;
  expanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string, label: string) => void;
  deleting?: boolean;
}) {
  const trainActions = quoteTrainActions(quote);

  return (
    <article className="card">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left flex items-start justify-between gap-4 min-h-[44px]"
        aria-expanded={expanded}
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-lg font-bold">{quote.name}</h3>
            <StatusBadge status={quote.status} />
          </div>
          <p className="text-gray-600 text-sm">
            {new Date(quote.createdAt).toLocaleString("fr-FR")} — {quote.deviceType}
          </p>
          {!expanded && (
            <p className="text-gray-700 mt-2 line-clamp-2">{quote.problemDesc}</p>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-primary shrink-0 mt-1" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5 text-primary shrink-0 mt-1" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
          <div>
            <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
              <Monitor className="h-4 w-4" aria-hidden="true" />
              Problème signalé
            </h4>
            <p className="text-gray-700 bg-background rounded-xl p-4 leading-relaxed">
              {quote.problemDesc}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-base">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <a href={`tel:${quote.phone}`} className="font-semibold text-primary hover:underline">
                  {quote.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${quote.email}`} className="font-semibold text-primary hover:underline break-all">
                  {quote.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm text-gray-500">Adresse</p>
                <p className="font-semibold">{quote.address}, {quote.city}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm text-gray-500">Disponibilités</p>
                <p className="font-semibold">
                  {formatPreferredDays(quote.preferredDays)}
                  {" — "}
                  {timeLabels[quote.preferredTime] || quote.preferredTime}
                </p>
                {quote.preferredDate && (
                  <p className="text-gray-600 text-sm mt-1">
                    Date souhaitée : {new Date(quote.preferredDate).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {quote.status === "new" && (
              <Button size="sm" onClick={() => onUpdateStatus(quote.id, "contacted")}>
                Marquer contacté
              </Button>
            )}
            {quote.status !== "done" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(quote.id, "done")}
              >
                Marquer terminé
              </Button>
            )}
            <Button size="sm" variant="secondary" asChild>
              <a href={`tel:${quote.phone}`}>Appeler</a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={`mailto:${quote.email}?subject=Votre demande VoisinTech`}>Répondre par email</a>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              disabled={deleting}
              onClick={() => onDelete(quote.id, `le devis de ${quote.name}`)}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Supprimer
            </Button>
          </div>

          <TrainAppLinks
            title="Apps Train — traiter la demande"
            actions={trainActions.workflow}
          />

          {(quote.status === "contacted" || quote.status === "done") && (
            <TrainAppLinks
              title="Après intervention"
              actions={trainActions.postIntervention}
            />
          )}
        </div>
      )}
    </article>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [proRequests, setProRequests] = useState<ProRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"quotes" | "pro" | "contacts">("quotes");
  const [quoteFilter, setQuoteFilter] = useState<"all" | "new" | "contacted" | "done">("all");
  const [contactFilter, setContactFilter] = useState<"all" | "new" | "done">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const [dataRes, statsRes] = await Promise.all([
        fetch("/api/admin"),
        fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "stats" }),
        }),
      ]);

      if (dataRes.status === 401) {
        router.push("/admin");
        return;
      }

      const data = await dataRes.json();
      const statsData = await statsRes.json();
      setQuotes(data.quotes || []);
      setContacts(data.contacts || []);
      setProRequests(data.proRequests || []);
      setStats(statsData);

      const newest = data.quotes?.[0];
      if (newest && newest.status === "new") {
        setExpandedId(newest.id);
      }
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (type: string, id: string, status: string) => {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-status", type, id, status }),
    });
    loadData();
  };

  const deleteItem = async (type: "quote" | "contact" | "pro", id: string, label: string) => {
    if (!window.confirm(`Supprimer définitivement ${label} ? Cette action est irréversible.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", type, id }),
      });

      if (!res.ok) {
        alert("Erreur lors de la suppression.");
        return;
      }

      if (expandedId === id) setExpandedId(null);
      await loadData();
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  };

  const logout = async () => {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredQuotes = quotes.filter(
    (q) => quoteFilter === "all" || q.status === quoteFilter
  );
  const filteredContacts = contacts.filter((c) => {
    if (contactFilter === "all") return true;
    if (contactFilter === "new") return c.status === "new";
    return c.status !== "new";
  });

  return (
    <div className="section-padding">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/admin/avis">Modérer les avis</Link>
            </Button>
            <Button variant="ghost" onClick={logout}>
              Déconnexion
            </Button>
          </div>
        </div>

        {stats && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <p className="text-sm text-gray-500">Devis cette semaine</p>
              <p className="text-3xl font-bold text-primary">{stats.quotesWeek}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Devis ce mois</p>
              <p className="text-3xl font-bold text-primary">{stats.quotesMonth}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Messages cette semaine</p>
              <p className="text-3xl font-bold text-primary">{stats.contactsWeek}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Avis en attente</p>
              <p className="text-3xl font-bold text-success">{stats.pendingReviews}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6 flex-wrap">
          <Button
            variant={tab === "quotes" ? "default" : "outline"}
            onClick={() => setTab("quotes")}
          >
            Dépannage ({quotes.length})
          </Button>
          <Button
            variant={tab === "pro" ? "default" : "outline"}
            onClick={() => setTab("pro")}
          >
            Espace Pro ({proRequests.length})
          </Button>
          <Button
            variant={tab === "contacts" ? "default" : "outline"}
            onClick={() => setTab("contacts")}
          >
            Messages ({contacts.length})
          </Button>
        </div>

        {tab === "quotes" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {(
                [
                  { value: "all", label: "Tous" },
                  { value: "new", label: "Nouveaux" },
                  { value: "contacted", label: "Contactés" },
                  { value: "done", label: "Terminés" },
                ] as const
              ).map((f) => (
                <Button
                  key={f.value}
                  size="sm"
                  variant={quoteFilter === f.value ? "default" : "outline"}
                  onClick={() => setQuoteFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
            {filteredQuotes.map((q) => (
              <QuoteCard
                key={q.id}
                quote={q}
                expanded={expandedId === q.id}
                onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
                onUpdateStatus={(id, status) => updateStatus("quote", id, status)}
                onDelete={(id, label) => deleteItem("quote", id, label)}
                deleting={deletingId === q.id}
              />
            ))}
            {filteredQuotes.length === 0 && (
              <p className="text-center text-gray-500 py-12">Aucune demande de devis</p>
            )}
          </div>
        )}

        {tab === "pro" && (
          <div className="space-y-4">
            {proRequests.map((p) => {
              const details = formatProDetails(p.details);
              return (
                <article key={p.id} className="card">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold">{p.name}</h3>
                    <StatusBadge status={p.status} />
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {proServiceLabels[p.serviceType] || p.serviceType}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {new Date(p.createdAt).toLocaleString("fr-FR")}
                    {p.company ? ` — ${p.company}` : ""} — {p.city}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                    <p>
                      <span className="text-gray-500">Tél :</span>{" "}
                      <a href={`tel:${p.phone}`} className="text-primary font-semibold">{p.phone}</a>
                    </p>
                    <p>
                      <span className="text-gray-500">Email :</span>{" "}
                      <a href={`mailto:${p.email}`} className="text-primary break-all">{p.email}</a>
                    </p>
                  </div>
                  <div className="bg-background rounded-xl p-4 space-y-2 text-sm">
                    {details.map(([label, value]) => (
                      <p key={label}>
                        <span className="font-semibold text-primary">{label} :</span>{" "}
                        <span className="text-gray-700">{String(value || "—")}</span>
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {p.status === "new" && (
                      <Button size="sm" onClick={() => updateStatus("pro", p.id, "contacted")}>
                        Marquer contacté
                      </Button>
                    )}
                    {p.status !== "done" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus("pro", p.id, "done")}>
                        Marquer terminé
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${p.email}`}>Répondre</a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      disabled={deletingId === p.id}
                      onClick={() => deleteItem("pro", p.id, `la demande pro de ${p.name}`)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Supprimer
                    </Button>
                  </div>
                </article>
              );
            })}
            {proRequests.length === 0 && (
              <p className="text-center text-gray-500 py-12">Aucune demande Espace Pro</p>
            )}
          </div>
        )}

        {tab === "contacts" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {(
                [
                  { value: "all", label: "Tous" },
                  { value: "new", label: "Nouveaux" },
                  { value: "done", label: "Traités" },
                ] as const
              ).map((f) => (
                <Button
                  key={f.value}
                  size="sm"
                  variant={contactFilter === f.value ? "default" : "outline"}
                  onClick={() => setContactFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
            {filteredContacts.map((c) => (
              <div key={c.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-lg">{c.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(c.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <StatusBadge status={c.status === "new" ? "new" : "done"} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mb-4 text-base">
                  <p>
                    <span className="text-gray-500">Email : </span>
                    <a href={`mailto:${c.email}`} className="text-primary font-semibold hover:underline">
                      {c.email}
                    </a>
                  </p>
                  {c.phone && (
                    <p>
                      <span className="text-gray-500">Tél : </span>
                      <a href={`tel:${c.phone}`} className="text-primary font-semibold hover:underline">
                        {c.phone}
                      </a>
                    </p>
                  )}
                </div>
                <p className="text-gray-700 bg-background rounded-xl p-4 leading-relaxed">{c.message}</p>
                <div className="flex gap-3 mt-4">
                  {c.status === "new" && (
                    <Button size="sm" onClick={() => updateStatus("contact", c.id, "done")}>
                      Marquer traité
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${c.email}`}>Répondre</a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    disabled={deletingId === c.id}
                    onClick={() => deleteItem("contact", c.id, `le message de ${c.name}`)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Supprimer
                  </Button>
                </div>
                <TrainAppLinks
                  title="Apps Train"
                  actions={contactTrainActions(c)}
                />
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <p className="text-center text-gray-500 py-12">Aucun message</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
