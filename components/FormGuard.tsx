"use client";

import { useRef } from "react";

export function getFormGuardPayload(formRef: React.RefObject<HTMLFormElement | null>) {
  const form = formRef.current;
  if (!form) return { website: "", _ts: Date.now() };

  const website = (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
  const tsRaw = (form.elements.namedItem("_ts") as HTMLInputElement | null)?.value;
  return {
    website,
    _ts: tsRaw ? Number(tsRaw) : Date.now(),
  };
}

export function FormGuardFields() {
  const loadedAt = useRef(Date.now());

  return (
    <>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
        defaultValue=""
      />
      <input type="hidden" name="_ts" value={loadedAt.current} readOnly />
    </>
  );
}
