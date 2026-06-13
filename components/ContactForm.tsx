"use client";

import { useState, useRef } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormGuardFields, getFormGuardPayload } from "@/components/FormGuard";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Votre nom est requis.";
    if (!form.email.trim()) e.email = "Votre email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email invalide.";
    if (!form.message.trim()) e.message = "Votre message est requis.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...getFormGuardPayload(formRef) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : "Erreur lors de l'envoi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="card text-center py-8" role="status">
        <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" aria-hidden="true" />
        <h3 className="text-xl font-bold mb-2">Message envoyé !</h3>
        <p className="text-gray-600">Je vous réponds dans les plus brefs délais.</p>
        <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="card space-y-5 relative">
      <FormGuardFields />
      <div>
        <Label htmlFor="contact-name">Nom *</Label>
        <Input
          id="contact-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-red-600 text-sm mt-1" role="alert">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="contact-email">Email *</Label>
        <Input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-red-600 text-sm mt-1" role="alert">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="contact-phone">Téléphone (facultatif)</Label>
        <Input
          id="contact-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea
          id="contact-message"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          aria-invalid={!!errors.message}
        />
        {errors.message && <p className="text-red-600 text-sm mt-1" role="alert">{errors.message}</p>}
      </div>
      {errors.submit && (
        <p className="text-red-600 text-sm" role="alert">{errors.submit}</p>
      )}
      <Button type="submit" disabled={submitting} size="lg" className="w-full">
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Envoi...
          </>
        ) : (
          "Envoyer le message"
        )}
      </Button>
    </form>
  );
}
