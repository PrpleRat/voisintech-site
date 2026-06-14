"use client";

import { useRef, useState } from "react";
import { CheckCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { business } from "@/config/content";
import {
  budgetRanges,
  deadlineOptions,
  proFormConfigs,
  siteWebFeatures,
  siteWebPageCounts,
  siteWebSiteTypes,
  urssafNeeds,
  urssafStatuses,
  urssafUrgency,
  type ProServiceType,
} from "@/config/pro-forms";
import { useRegion } from "@/components/RegionProvider";
import { FormGuardFields, getFormGuardPayload } from "@/components/FormGuard";
import { cn } from "@/lib/utils";

interface ContactData {
  name: string;
  phone: string;
  email: string;
  company: string;
  city: string;
}

interface SiteWebData {
  siteType: string;
  pageCount: string;
  hasExistingSite: string;
  existingUrl: string;
  budget: string;
  deadline: string;
  features: string[];
  projectDesc: string;
}

interface UrssafData {
  legalStatus: string;
  sector: string;
  needs: string[];
  urgency: string;
  projectDesc: string;
}

const emptyContact: ContactData = {
  name: "",
  phone: "",
  email: "",
  company: "",
  city: "",
};

export function ProRequestForm({ serviceType }: { serviceType: ProServiceType }) {
  const config = proFormConfigs[serviceType];
  const { config: region } = useRegion();
  const formRef = useRef<HTMLFormElement>(null);

  const [step, setStep] = useState(1);
  const [contact, setContact] = useState<ContactData>({ ...emptyContact, city: region.hubCity });
  const [siteWeb, setSiteWeb] = useState<SiteWebData>({
    siteType: "",
    pageCount: "",
    hasExistingSite: "",
    existingUrl: "",
    budget: "",
    deadline: "",
    features: [],
    projectDesc: "",
  });
  const [urssaf, setUrssaf] = useState<UrssafData>({
    legalStatus: "",
    sector: "",
    needs: [],
    urgency: "",
    projectDesc: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleFeature = (list: string[], value: string, setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  const validateProject = () => {
    const e: Record<string, string> = {};
    if (serviceType === "site-web") {
      if (!siteWeb.siteType) e.siteType = "Sélectionnez un type de site.";
      if (!siteWeb.pageCount) e.pageCount = "Indiquez le nombre de pages souhaité.";
      if (!siteWeb.budget) e.budget = "Indiquez une fourchette budgétaire.";
      if (!siteWeb.deadline) e.deadline = "Indiquez un délai.";
      if (!siteWeb.projectDesc.trim() || siteWeb.projectDesc.trim().length < 20)
        e.projectDesc = "Décrivez votre projet (20 caractères minimum).";
      if (siteWeb.hasExistingSite === "oui" && !siteWeb.existingUrl.trim())
        e.existingUrl = "Indiquez l'URL de votre site actuel.";
    } else {
      if (!urssaf.legalStatus) e.legalStatus = "Sélectionnez votre statut.";
      if (urssaf.needs.length === 0) e.needs = "Sélectionnez au moins un besoin.";
      if (!urssaf.urgency) e.urgency = "Indiquez l'urgence.";
      if (!urssaf.projectDesc.trim() || urssaf.projectDesc.trim().length < 20)
        e.projectDesc = "Décrivez votre situation (20 caractères minimum).";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateContact = () => {
    const e: Record<string, string> = {};
    if (!contact.name.trim()) e.name = "Votre nom est requis.";
    if (!contact.phone.trim()) e.phone = "Votre téléphone est requis.";
    else if (!/^[\d\s+().-]{8,}$/.test(contact.phone)) e.phone = "Numéro invalide.";
    if (!contact.email.trim()) e.email = "Votre email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) e.email = "Email invalide.";
    if (!contact.city.trim()) e.city = "Votre ville est requise.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validateContact()) return;
    setSubmitting(true);
    try {
      const payload =
        serviceType === "site-web"
          ? { serviceType, contact, details: siteWeb }
          : { serviceType, contact, details: urssaf };

      const res = await fetch("/api/pro-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, ...getFormGuardPayload(formRef) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'envoi");
      }
      setSuccess(true);
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : "Une erreur est survenue.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="card text-center py-12" role="status">
        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-bold mb-4">{config.successTitle}</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">{config.successMessage}</p>
        <p className="text-gray-600">
          Confirmation envoyée à <strong>{contact.email}</strong>.
        </p>
        <p className="mt-6">
          <a href={`tel:${business.phoneRaw}`} className="phone-link">
            {business.phone}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8" aria-label="Progression">
        <div className="flex gap-4 mb-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm",
                s <= step ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
              )}
              aria-current={s === step ? "step" : undefined}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="flex gap-16 text-sm text-gray-600">
          <span>Votre projet</span>
          <span>Coordonnées</span>
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 1 && validateProject()) {
            setStep(2);
            setErrors({});
          } else if (step === 2) submit();
        }}
        noValidate
      >
        <FormGuardFields />

        {step === 1 && serviceType === "site-web" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold mb-2">Votre projet web</h2>
              <p className="text-gray-600">Aidez-moi à comprendre ce dont vous avez besoin.</p>
            </div>

            <div>
              <Label htmlFor="siteType">Type de site *</Label>
              <select
                id="siteType"
                value={siteWeb.siteType}
                onChange={(e) => setSiteWeb({ ...siteWeb, siteType: e.target.value })}
                className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
              >
                <option value="">Choisir…</option>
                {siteWebSiteTypes.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.siteType && <p className="text-red-600 text-sm mt-1">{errors.siteType}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pageCount">Nombre de pages *</Label>
                <select
                  id="pageCount"
                  value={siteWeb.pageCount}
                  onChange={(e) => setSiteWeb({ ...siteWeb, pageCount: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
                >
                  <option value="">Choisir…</option>
                  {siteWebPageCounts.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {errors.pageCount && <p className="text-red-600 text-sm mt-1">{errors.pageCount}</p>}
              </div>
              <div>
                <Label htmlFor="budget">Budget indicatif *</Label>
                <select
                  id="budget"
                  value={siteWeb.budget}
                  onChange={(e) => setSiteWeb({ ...siteWeb, budget: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
                >
                  <option value="">Choisir…</option>
                  {budgetRanges.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {errors.budget && <p className="text-red-600 text-sm mt-1">{errors.budget}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">Délai souhaité *</Label>
              <select
                id="deadline"
                value={siteWeb.deadline}
                onChange={(e) => setSiteWeb({ ...siteWeb, deadline: e.target.value })}
                className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
              >
                <option value="">Choisir…</option>
                {deadlineOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.deadline && <p className="text-red-600 text-sm mt-1">{errors.deadline}</p>}
            </div>

            <fieldset>
              <legend className="font-semibold mb-2">Site existant ?</legend>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "non", label: "Non, création from scratch" },
                  { value: "oui", label: "Oui, refonte / amélioration" },
                ].map((o) => (
                  <label key={o.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasExistingSite"
                      checked={siteWeb.hasExistingSite === o.value}
                      onChange={() => setSiteWeb({ ...siteWeb, hasExistingSite: o.value })}
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {siteWeb.hasExistingSite === "oui" && (
              <div>
                <Label htmlFor="existingUrl">URL du site actuel *</Label>
                <Input
                  id="existingUrl"
                  value={siteWeb.existingUrl}
                  onChange={(e) => setSiteWeb({ ...siteWeb, existingUrl: e.target.value })}
                  placeholder="https://..."
                />
                {errors.existingUrl && <p className="text-red-600 text-sm mt-1">{errors.existingUrl}</p>}
              </div>
            )}

            <fieldset>
              <legend className="font-semibold mb-2">Fonctionnalités souhaitées</legend>
              <div className="grid sm:grid-cols-2 gap-2">
                {siteWebFeatures.map((f) => (
                  <label key={f.value} className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={siteWeb.features.includes(f.value)}
                      onChange={() =>
                        toggleFeature(siteWeb.features, f.value, (features) =>
                          setSiteWeb({ ...siteWeb, features })
                        )
                      }
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <Label htmlFor="projectDesc">Décrivez votre activité et votre projet *</Label>
              <Textarea
                id="projectDesc"
                rows={5}
                value={siteWeb.projectDesc}
                onChange={(e) => setSiteWeb({ ...siteWeb, projectDesc: e.target.value })}
                placeholder="Ex : Je suis artisan plombier à Tarbes. Je veux un site vitrine avec mes services, zone d'intervention, formulaire de contact et référencement local…"
              />
              {errors.projectDesc && <p className="text-red-600 text-sm mt-1">{errors.projectDesc}</p>}
            </div>
          </div>
        )}

        {step === 1 && serviceType === "urssaf" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold mb-2">Votre situation</h2>
              <p className="text-gray-600">Pas de jargon administratif — décrivez où vous en êtes.</p>
            </div>

            <div>
              <Label htmlFor="legalStatus">Statut ou projet *</Label>
              <select
                id="legalStatus"
                value={urssaf.legalStatus}
                onChange={(e) => setUrssaf({ ...urssaf, legalStatus: e.target.value })}
                className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
              >
                <option value="">Choisir…</option>
                {urssafStatuses.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.legalStatus && <p className="text-red-600 text-sm mt-1">{errors.legalStatus}</p>}
            </div>

            <div>
              <Label htmlFor="sector">Activité / secteur</Label>
              <Input
                id="sector"
                value={urssaf.sector}
                onChange={(e) => setUrssaf({ ...urssaf, sector: e.target.value })}
                placeholder="Ex : dépannage informatique, coiffure, vente en ligne…"
              />
            </div>

            <fieldset>
              <legend className="font-semibold mb-2">Besoins *</legend>
              <div className="grid gap-2">
                {urssafNeeds.map((n) => (
                  <label key={n.value} className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={urssaf.needs.includes(n.value)}
                      onChange={() =>
                        toggleFeature(urssaf.needs, n.value, (needs) =>
                          setUrssaf({ ...urssaf, needs })
                        )
                      }
                    />
                    {n.label}
                  </label>
                ))}
              </div>
              {errors.needs && <p className="text-red-600 text-sm mt-1">{errors.needs}</p>}
            </fieldset>

            <div>
              <Label htmlFor="urgency">Urgence *</Label>
              <select
                id="urgency"
                value={urssaf.urgency}
                onChange={(e) => setUrssaf({ ...urssaf, urgency: e.target.value })}
                className="mt-1 w-full rounded-xl border border-primary/20 px-3 py-2.5 min-h-[44px]"
              >
                <option value="">Choisir…</option>
                {urssafUrgency.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.urgency && <p className="text-red-600 text-sm mt-1">{errors.urgency}</p>}
            </div>

            <div>
              <Label htmlFor="urssafDesc">Décrivez votre situation *</Label>
              <Textarea
                id="urssafDesc"
                rows={5}
                value={urssaf.projectDesc}
                onChange={(e) => setUrssaf({ ...urssaf, projectDesc: e.target.value })}
                placeholder="Ex : Auto-entrepreneur depuis 3 mois, je ne sais pas comment faire ma déclaration URSSAF et j'ai peur de me tromper sur le CA déclaré…"
              />
              {errors.projectDesc && <p className="text-red-600 text-sm mt-1">{errors.projectDesc}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold mb-2">Vos coordonnées</h2>
              <p className="text-gray-600">Pour vous recontacter avec une proposition.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input id="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="company">Entreprise / activité</Label>
                <Input id="company" value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input id="phone" type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="city">Ville *</Label>
                <Input id="city" value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
              </div>
            </div>
          </div>
        )}

        {errors.submit && (
          <p className="text-red-600 mt-4 p-4 bg-red-50 rounded-xl" role="alert">{errors.submit}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => { setStep(1); setErrors({}); }}>
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              Retour
            </Button>
          )}
          <Button type="submit" disabled={submitting} className="flex-1" size="lg">
            {submitting ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Envoi…</>
            ) : step < 2 ? (
              <>Continuer <ArrowRight className="h-5 w-5" /></>
            ) : (
              "Envoyer ma demande"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
