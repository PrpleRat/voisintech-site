import type { Metadata } from "next";
import { VillesList } from "@/components/VillesList";

export const metadata: Metadata = {
  title: "Villes desservies — Dépannage informatique à domicile",
  description:
    "VoisinTech intervient à Toulouse, Lourdes, Tarbes, Blagnac, Argelès-Gazost, Jarret et environs.",
};

export default function VillesPage() {
  return <VillesList />;
}
