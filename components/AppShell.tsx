"use client";

import { RegionProvider } from "@/components/RegionProvider";
import { RegionGate } from "@/components/RegionGate";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyContactButtons } from "@/components/StickyContactButtons";
import { Analytics } from "@/components/Analytics";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <RegionProvider>
      <RegionGate />
      <Analytics />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyContactButtons />
    </RegionProvider>
  );
}
