"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Step2Data {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

interface Step2Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  errors: Partial<Record<keyof Step2Data, string>>;
}

export function Step2({ data, onChange, errors }: Step2Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Vos coordonnées</h2>
        <p className="text-gray-600">
          Pour que je puisse vous recontacter et venir chez vous.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Nom complet *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-red-600 mt-1 text-sm" role="alert">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            placeholder="06 12 34 56 78"
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <p className="text-red-600 mt-1 text-sm" role="alert">{errors.phone}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-red-600 mt-1 text-sm" role="alert">{errors.email}</p>}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="address">Adresse *</Label>
          <Input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            value={data.address}
            onChange={(e) => onChange({ ...data, address: e.target.value })}
            placeholder="12 rue des Fleurs"
            aria-invalid={!!errors.address}
          />
          {errors.address && <p className="text-red-600 mt-1 text-sm" role="alert">{errors.address}</p>}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="city">Ville *</Label>
          <Input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            placeholder="Toulouse"
            aria-invalid={!!errors.city}
          />
          {errors.city && <p className="text-red-600 mt-1 text-sm" role="alert">{errors.city}</p>}
        </div>
      </div>
    </div>
  );
}
