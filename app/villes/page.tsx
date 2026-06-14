import type { Metadata } from "next";
import Link from "next/link";
import { VillesList } from "@/components/VillesList";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Villes desservies — Dépannage informatique Toulouse & Bigorre",
  description:
    "VoisinTech intervient à Toulouse, Blagnac, Colomiers, Lourdes, Tarbes et environs. Dépannage informatique à domicile.",
  path: "/villes",
});

export default function VillesPage() {
  return (
    <>
      <section className="section-padding pb-0">
        <div className="container-page max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">
            Dépannage informatique — villes desservies
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            VoisinTech (voisintech.fr) se déplace à domicile pour réparer vos
            ordinateurs, smartphones et box internet.{" "}
            <Link href="/villes/toulouse" className="text-primary font-semibold hover:underline">
              Dépannage informatique à Toulouse
            </Link>{" "}
            et agglomération, ou Bigorre selon votre zone.
          </p>
        </div>
      </section>
      <VillesList />
    </>
  );
}
