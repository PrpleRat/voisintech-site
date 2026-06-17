"use client";

import { useRef, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormGuardFields, getFormGuardPayload } from "@/components/FormGuard";
import { suiteActivities, suiteApps, suiteBrand } from "@/config/train-suite";

export function SuiteBetaForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    activity: "",
    message: "",
  });
  const [apps, setApps] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleApp = (id: string, checked: boolean) => {
    setApps((prev) =>
      checked ? [...prev, id] : prev.filter((appId) => appId !== id)
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Votre nom est requis.";
    if (!form.email.trim()) e.email = "Votre email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide.";
    if (!form.phone.trim()) e.phone = "Votre téléphone est requis.";
    else if (!/^[\d\s+().-]{8,}$/.test(form.phone)) e.phone = "Numéro invalide.";
    if (!form.activity) e.activity = "Indiquez votre activité.";
    if (apps.length === 0) e.apps = "Choisissez au moins une app.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/suite-beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          appsInterested: apps,
          ...getFormGuardPayload(formRef),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'inscription.");
      setSuccess(true);
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : "Erreur lors de l'inscription.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="card text-center py-10 px-6" role="status">
        <CheckCircle className="h-14 w-14 text-success mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-extrabold mb-3">Inscription enregistrée</h2>
        <p className="text-lg text-gray-700 leading-relaxed max-w-md mx-auto">
          Merci ! Vous êtes sur la liste d&apos;attente beta iOS {suiteBrand.name}.
          On vous envoie le lien TestFlight par email ou SMS dès qu&apos;une place se libère.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      className="card space-y-6 relative"
      aria-labelledby="beta-form-title"
    >
      <FormGuardFields />
      <div>
        <h2 id="beta-form-title" className="text-2xl font-extrabold mb-2">
          Rejoindre la beta iOS
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          iPhone ou iPad uniquement. Places limitées — priorité aux micro-entrepreneurs actifs.
        </p>
      </div>

      <div>
        <Label htmlFor="beta-name" className="text-base">
          Nom complet *
        </Label>
        <Input
          id="beta-name"
          autoComplete="name"
          className="text-lg min-h-[48px]"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-red-600 text-base mt-1" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="beta-email" className="text-base">
            Email *
          </Label>
          <Input
            id="beta-email"
            type="email"
            autoComplete="email"
            className="text-lg min-h-[48px]"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-red-600 text-base mt-1" role="alert">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="beta-phone" className="text-base">
            Téléphone *
          </Label>
          <Input
            id="beta-phone"
            type="tel"
            autoComplete="tel"
            className="text-lg min-h-[48px]"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-red-600 text-base mt-1" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="beta-activity" className="text-base">
          Votre activité *
        </Label>
        <select
          id="beta-activity"
          className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          value={form.activity}
          onChange={(e) => setForm({ ...form, activity: e.target.value })}
          aria-invalid={!!errors.activity}
        >
          <option value="">Choisir…</option>
          {suiteActivities.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {errors.activity && (
          <p className="text-red-600 text-base mt-1" role="alert">
            {errors.activity}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="text-base font-semibold mb-3">
          Quelles apps vous intéressent ? *
        </legend>
        <div className="grid sm:grid-cols-2 gap-3">
          {suiteApps.map((app) => {
            const checked = apps.includes(app.id);
            const inputId = `beta-app-${app.id}`;
            return (
              <label
                key={app.id}
                htmlFor={inputId}
                className="flex items-start gap-3 rounded-2xl border-2 border-primary/15 p-4 cursor-pointer min-h-[56px] has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <Checkbox
                  id={inputId}
                  checked={checked}
                  onCheckedChange={(value) => toggleApp(app.id, value === true)}
                />
                <span>
                  <span className="block font-bold text-lg">{app.marketingName}</span>
                  <span className="block text-gray-600">{app.tagline}</span>
                </span>
              </label>
            );
          })}
        </div>
        {errors.apps && (
          <p className="text-red-600 text-base mt-2" role="alert">
            {errors.apps}
          </p>
        )}
      </fieldset>

      <div>
        <Label htmlFor="beta-message" className="text-base">
          Message (facultatif)
        </Label>
        <Textarea
          id="beta-message"
          rows={4}
          className="text-lg"
          placeholder="Ex. : je suis dépanneur à Toulouse, je facture 10 clients par mois…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {errors.submit && (
        <p className="text-red-600 text-base p-4 bg-red-50 rounded-xl" role="alert">
          {errors.submit}
        </p>
      )}

      <Button type="submit" disabled={submitting} size="lg" className="w-full text-lg">
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Inscription…
          </>
        ) : (
          "M'inscrire à la beta iOS"
        )}
      </Button>

      <p className="text-sm text-gray-600 leading-relaxed">
        En vous inscrivant, vous acceptez d&apos;être contacté pour l&apos;accès TestFlight.
        Aucun spam — désinscription possible à tout moment.
      </p>
    </form>
  );
}
