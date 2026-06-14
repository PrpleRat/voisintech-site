import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ProRequestForm } from "@/components/ProForm/ProRequestForm";
import { proFormConfigs } from "@/config/pro-forms";
import { business } from "@/config/content";

const config = proFormConfigs.urssaf;

export const metadata: Metadata = {
  title: config.title,
  description:
    "Accompagnement URSSAF et démarches admin pour auto-entrepreneurs et micro-entreprises. VoisinTech vous guide pas à pas.",
};

export default function UrssafDevisPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-2xl">
        <p className="mb-4">
          <Link href="/pro" className="text-primary text-sm hover:underline">
            ← Espace Pro
          </Link>
        </p>
        <h1 className="text-4xl font-bold mb-4">{config.title}</h1>
        <p className="text-lg text-gray-600 mb-8">{config.subtitle}</p>
        <div className="card">
          <Suspense fallback={<p>Chargement…</p>}>
            <ProRequestForm serviceType="urssaf" />
          </Suspense>
        </div>
        <p className="text-center text-gray-600 mt-6">
          Une question ?{" "}
          <a href={`tel:${business.phoneRaw}`} className="phone-link">{business.phone}</a>
        </p>
      </div>
    </div>
  );
}
