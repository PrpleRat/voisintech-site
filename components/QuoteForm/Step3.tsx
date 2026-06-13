"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { timeSlots, weekDays } from "@/config/content";
import { cn } from "@/lib/utils";

export interface Step3Data {
  preferredDate: string;
  preferredDays: string[];
  preferredTime: string;
}

interface Step3Props {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
  errors: Partial<Record<keyof Step3Data, string>>;
}

export function Step3({ data, onChange, errors }: Step3Props) {
  const toggleDay = (day: string) => {
    const days = data.preferredDays.includes(day)
      ? data.preferredDays.filter((d) => d !== day)
      : [...data.preferredDays, day];
    onChange({ ...data, preferredDays: days });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Vos disponibilités</h2>
        <p className="text-gray-600">
          Indiquez quand vous seriez disponible pour une visite à domicile.
        </p>
      </div>

      <div>
        <Label htmlFor="preferredDate">Date souhaitée (facultatif)</Label>
        <Input
          id="preferredDate"
          name="preferredDate"
          type="date"
          value={data.preferredDate}
          onChange={(e) => onChange({ ...data, preferredDate: e.target.value })}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <fieldset>
        <legend className="text-base font-semibold mb-3">Jours préférés *</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {weekDays.map((day) => (
            <label
              key={day.value}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer min-h-[44px]",
                data.preferredDays.includes(day.value)
                  ? "border-primary bg-primary/5"
                  : "border-gray-200"
              )}
            >
              <Checkbox
                checked={data.preferredDays.includes(day.value)}
                onCheckedChange={() => toggleDay(day.value)}
                aria-label={day.label}
              />
              <span className="text-base">{day.label}</span>
            </label>
          ))}
        </div>
        {errors.preferredDays && (
          <p className="text-red-600 mt-2 text-sm" role="alert">{errors.preferredDays}</p>
        )}
      </fieldset>

      <fieldset>
        <legend className="text-base font-semibold mb-3">Créneau horaire préféré *</legend>
        <div className="grid gap-3">
          {timeSlots.map((slot) => (
            <label
              key={slot.value}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer min-h-[44px]",
                data.preferredTime === slot.value
                  ? "border-primary bg-primary/5"
                  : "border-gray-200"
              )}
            >
              <input
                type="radio"
                name="preferredTime"
                value={slot.value}
                checked={data.preferredTime === slot.value}
                onChange={(e) => onChange({ ...data, preferredTime: e.target.value })}
                className="h-5 w-5"
              />
              <span className="text-base font-medium">{slot.label}</span>
            </label>
          ))}
        </div>
        {errors.preferredTime && (
          <p className="text-red-600 mt-2 text-sm" role="alert">{errors.preferredTime}</p>
        )}
      </fieldset>
    </div>
  );
}
