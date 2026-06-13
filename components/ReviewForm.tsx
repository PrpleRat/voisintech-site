"use client";

import { useState, useRef } from "react";
import { Star, Loader2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormGuardFields, getFormGuardPayload } from "@/components/FormGuard";

export function ReviewForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (!form.name.trim()) e2.name = "Votre nom est requis.";
    if (!form.comment.trim()) e2.comment = "Votre commentaire est requis.";
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...getFormGuardPayload(formRef) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setSuccess(true);
      setForm({ name: "", rating: 5, comment: "" });
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
        <h3 className="text-xl font-bold mb-2">Merci pour votre avis !</h3>
        <p className="text-gray-600">
          Votre témoignage sera publié après validation. Merci de votre confiance !
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className="card space-y-5 relative">
      <FormGuardFields />
      <h3 className="text-xl font-bold">Laisser un avis</h3>

      <div>
        <Label htmlFor="review-name">Votre prénom ou initiales *</Label>
        <Input
          id="review-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p className="text-red-600 text-sm mt-1" role="alert">{errors.name}</p>}
      </div>

      <fieldset>
        <legend className="text-base font-semibold mb-2">Note *</legend>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setForm({ ...form, rating: n })}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
            >
              <Star
                className={`h-8 w-8 ${
                  n <= form.rating ? "fill-success text-success" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="review-comment">Votre témoignage *</Label>
        <Textarea
          id="review-comment"
          rows={4}
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          placeholder="Décrivez votre expérience avec VoisinTech..."
        />
        {errors.comment && <p className="text-red-600 text-sm mt-1" role="alert">{errors.comment}</p>}
      </div>

      {errors.submit && <p className="text-red-600 text-sm" role="alert">{errors.submit}</p>}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Envoi...
          </>
        ) : (
          "Envoyer mon avis"
        )}
      </Button>
    </form>
  );
}
