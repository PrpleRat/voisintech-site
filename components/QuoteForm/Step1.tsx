"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deviceTypes } from "@/config/content";
import { cn } from "@/lib/utils";

export interface Step1Data {
  deviceType: string;
  problemDesc: string;
}

interface Step1Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  errors: Partial<Record<keyof Step1Data, string>>;
  selectedService?: string;
}

export function Step1({ data, onChange, errors, selectedService }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quel est votre problème ?</h2>
        <p className="text-gray-600">
          Décrivez votre appareil et ce qui ne fonctionne pas. Pas besoin de termes techniques !
        </p>
      </div>

      {selectedService && (
        <p className="bg-primary/10 text-primary font-semibold rounded-xl px-4 py-3 text-base">
          Service sélectionné : {selectedService}
        </p>
      )}

      <fieldset>
        <legend className="text-base font-semibold mb-3">Type d&apos;appareil *</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {deviceTypes.map((type) => (
            <label
              key={type}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer min-h-[44px] transition-colors",
                data.deviceType === type
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/30"
              )}
            >
              <input
                type="radio"
                name="deviceType"
                value={type}
                checked={data.deviceType === type}
                onChange={(e) => onChange({ ...data, deviceType: e.target.value })}
                className="h-5 w-5 text-primary"
              />
              <span className="text-base font-medium">{type}</span>
            </label>
          ))}
        </div>
        {errors.deviceType && (
          <p className="text-red-600 mt-2 text-sm" role="alert">{errors.deviceType}</p>
        )}
      </fieldset>

      <div>
        <Label htmlFor="problemDesc">Décrivez le problème *</Label>
        <Textarea
          id="problemDesc"
          name="problemDesc"
          value={data.problemDesc}
          onChange={(e) => onChange({ ...data, problemDesc: e.target.value })}
          placeholder="Exemple : Mon ordinateur est très lent depuis une semaine, et des fenêtres bizarres s'ouvrent toutes seules..."
          rows={5}
          aria-invalid={!!errors.problemDesc}
          aria-describedby={errors.problemDesc ? "problemDesc-error" : undefined}
        />
        {errors.problemDesc && (
          <p id="problemDesc-error" className="text-red-600 mt-2 text-sm" role="alert">
            {errors.problemDesc}
          </p>
        )}
      </div>
    </div>
  );
}
