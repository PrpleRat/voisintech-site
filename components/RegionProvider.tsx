"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_REGION,
  getRegionConfig,
  type RegionConfig,
  type RegionId,
} from "@/config/regions";
import { readRegionFromDocument, writeRegionCookie } from "@/lib/region-storage";

interface RegionContextValue {
  region: RegionId;
  config: RegionConfig;
  isReady: boolean;
  needsSelection: boolean;
  setRegion: (region: RegionId) => void;
  openRegionPicker: () => void;
}

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<RegionId>(DEFAULT_REGION);
  const [isReady, setIsReady] = useState(false);
  const [needsSelection, setNeedsSelection] = useState(false);

  useEffect(() => {
    const stored = readRegionFromDocument();
    if (stored) {
      setRegionState(stored);
      setNeedsSelection(false);
    } else {
      setNeedsSelection(true);
    }
    setIsReady(true);
  }, []);

  const setRegion = useCallback((next: RegionId) => {
    writeRegionCookie(next);
    setRegionState(next);
    setNeedsSelection(false);
  }, []);

  const openRegionPicker = useCallback(() => {
    setNeedsSelection(true);
  }, []);

  const value = useMemo(
    () => ({
      region,
      config: getRegionConfig(region),
      isReady,
      needsSelection,
      setRegion,
      openRegionPicker,
    }),
    [region, isReady, needsSelection, setRegion, openRegionPicker]
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    throw new Error("useRegion must be used within RegionProvider");
  }
  return ctx;
}
