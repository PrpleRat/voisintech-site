"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Step1, Step1Data } from "./Step1";
import { Step2, Step2Data } from "./Step2";
import { Step3, Step3Data } from "./Step3";
import { Button } from "@/components/ui/button";
import { business, services } from "@/config/content";
import { cn } from "@/lib/utils";
import { FormGuardFields, getFormGuardPayload } from "@/components/FormGuard";

const initialStep2: Step2Data = { name: "", phone: "", email: "", address: "", city: "" };
const initialStep3: Step3Data = { preferredDate: "", preferredDays: [], preferredTime: "" };

export function QuoteForm() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");

  const preselectedService = services.find((s) => s.id === serviceId);

  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState<Step1Data>({
    deviceType: preselectedService?.deviceType ?? "",
    problemDesc: "",
  });
  const [step2, setStep2] = useState<Step2Data>(initialStep2);
  const [step3, setStep3] = useState<Step3Data>(initialStep3);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!step1.deviceType) e.deviceType = "Veuillez sélectionner un type d'appareil.";
    if (!step1.problemDesc.trim()) e.problemDesc = "Veuillez décrire votre problème.";
    else if (step1.problemDesc.trim().length < 10)
      e.problemDesc = "Merci de donner un peu plus de détails (10 caractères minimum).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!step2.name.trim()) e.name = "Votre nom est requis.";
    if (!step2.phone.trim()) e.phone = "Votre téléphone est requis.";
    else if (!/^[\d\s+().-]{8,}$/.test(step2.phone))
      e.phone = "Numéro de téléphone invalide.";
    if (!step2.email.trim()) e.email = "Votre email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step2.email))
      e.email = "Adresse email invalide.";
    if (!step2.address.trim()) e.address = "Votre adresse est requise.";
    if (!step2.city.trim()) e.city = "Votre ville est requise.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (step3.preferredDays.length === 0)
      e.preferredDays = "Sélectionnez au moins un jour.";
    if (!step3.preferredTime) e.preferredTime = "Sélectionnez un créneau horaire.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setErrors({});
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      setErrors({});
    }
  };

  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    setErrors({});
  };

  const submit = async () => {
    if (!validateStep3()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...step1,
          ...step2,
          ...step3,
          preferredDays: step3.preferredDays,
          ...getFormGuardPayload(formRef),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSuccess(true);
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : "Une erreur est survenue. Réessayez ou appelez-nous.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="card text-center py-12 max-w-xl mx-auto" role="status">
        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Demande envoyée avec succès !
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Merci {step2.name} ! Votre demande a bien été reçue.
          Je vous recontacte <strong>dans les 2 heures</strong> en journée.
        </p>
        <p className="text-gray-600 mb-6">
          Un email de confirmation vous a été envoyé à {step2.email}.
        </p>
        <p className="text-base">
          Besoin urgent ? Appelez le{" "}
          <a href={`tel:${business.phoneRaw}`} className="phone-link">
            {business.phone}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-8" aria-label="Progression du formulaire">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((s) => (
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
        <div className="flex justify-between text-sm text-gray-600">
          <span>Problème</span>
          <span>Coordonnées</span>
          <span>Disponibilités</span>
        </div>
      </div>

      {/* Progressive enhancement: noscript fallback handled via API */}
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) next();
          else submit();
        }}
        noValidate
        className="relative"
      >
        <FormGuardFields />
        {step === 1 && (
          <Step1
            data={step1}
            onChange={setStep1}
            selectedService={preselectedService?.title}
            errors={{
              deviceType: errors.deviceType,
              problemDesc: errors.problemDesc,
            }}
          />
        )}
        {step === 2 && (
          <Step2
            data={step2}
            onChange={setStep2}
            errors={{
              name: errors.name,
              phone: errors.phone,
              email: errors.email,
              address: errors.address,
              city: errors.city,
            }}
          />
        )}
        {step === 3 && (
          <Step3
            data={step3}
            onChange={setStep3}
            errors={{
              preferredDays: errors.preferredDays,
              preferredTime: errors.preferredTime,
            }}
          />
        )}

        {errors.submit && (
          <p className="text-red-600 mt-4 p-4 bg-red-50 rounded-xl" role="alert">
            {errors.submit}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={back} className="sm:w-auto">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              Retour
            </Button>
          )}
          <Button
            type="submit"
            disabled={submitting}
            className="flex-1"
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Envoi en cours...
              </>
            ) : step < 3 ? (
              <>
                Continuer
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </>
            ) : (
              "Envoyer ma demande de devis"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
