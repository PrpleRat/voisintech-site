import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Recycle,
  ArrowRightLeft,
  ArrowRight,
  Construction,
  Boxes,
  Monitor,
  Cpu,
  HardDrive,
  MemoryStick,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradeInEstimator } from "@/components/TradeInEstimator";
import { pageMetadata } from "@/lib/seo";
import { formatPrice, getPublicStoreData, type PublicStoreItem } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Matériel informatique — Neuf, occasion & reprise",
  description:
    "Achat de matériel informatique neuf et d'occasion, reprise de votre ancien équipement. VoisinTech, Toulouse et Lourdes.",
  path: "/materiel",
});

const CONTACT_PHONE = "0582950642";
const CONTACT_PHONE_DISPLAY = "05 82 95 06 42";
const CONTACT_EMAIL = "voisintech3@gmail.com";

function ProductCard({ item }: { item: PublicStoreItem }) {
  const contactSubject = encodeURIComponent(`Commande : ${item.name}`);

  return (
    <article className="card flex flex-col h-full">
      {item.imageUrl && (
        <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
      <p className="text-2xl font-bold text-primary mb-3">{formatPrice(item.sellPriceCents)}</p>
      {item.description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{item.description}</p>
      )}
      {item.category === "pc" && item.specs && (
        <ul className="text-sm text-gray-600 space-y-1 mb-4">
          {item.specs.cpu && (
            <li className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              {item.specs.cpu}
            </li>
          )}
          {item.specs.ram && (
            <li className="flex items-center gap-2">
              <MemoryStick className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              {item.specs.ram}
            </li>
          )}
          {item.specs.storage && (
            <li className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              {item.specs.storage}
            </li>
          )}
          {item.specs.screen && (
            <li className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              {item.specs.screen}
            </li>
          )}
        </ul>
      )}
      <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2">
        <Button asChild size="sm" className="flex-1">
          <Link href={`/contact?subject=${contactSubject}`}>Commander</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE_DISPLAY}</a>
        </Button>
      </div>
    </article>
  );
}

function PackCard({
  pack,
}: {
  pack: {
    id: string;
    name: string;
    description: string;
    sellPriceCents: number;
    items: { name: string; quantity: number }[];
  };
}) {
  const contactSubject = encodeURIComponent(`Demande pack : ${pack.name}`);

  return (
    <article className="card flex flex-col h-full border-2 border-accent/30">
      <div className="flex items-center gap-2 mb-2">
        <Boxes className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="text-xs font-semibold bg-accent/20 text-primary px-2 py-0.5 rounded-full">
          Pack
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2">{pack.name}</h3>
      <p className="text-2xl font-bold text-primary mb-3">{formatPrice(pack.sellPriceCents)}</p>
      {pack.description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-3">{pack.description}</p>
      )}
      <ul className="text-sm text-gray-600 space-y-1 mb-4 flex-1">
        {pack.items.map((pi, i) => (
          <li key={i}>
            {pi.quantity}× {pi.name}
          </li>
        ))}
      </ul>
      <div className="flex flex-col sm:flex-row gap-2 mt-auto">
        <Button asChild size="sm" className="flex-1">
          <Link href={`/contact?subject=${contactSubject}`}>Demander ce pack</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={`mailto:${CONTACT_EMAIL}?subject=${contactSubject}`}>Par email</a>
        </Button>
      </div>
    </article>
  );
}

export default async function MaterielPage() {
  const { items, packs, hasVisiblePcs } = await getPublicStoreData();

  const accessories = items.filter((i) => i.category === "accessory");
  const otherItems = items.filter((i) => i.category === "other");
  const pcs = items.filter((i) => i.category === "pc");

  return (
    <div className="section-padding">
      <div className="container-page">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-10 w-10 text-primary" aria-hidden="true" />
          <h1 className="text-4xl font-bold">Matériel</h1>
        </div>
        <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-3xl">
          Accessoires, packs sur mesure et PC reconditionnés — plus un service de reprise pour
          recycler votre ancien équipement. Conseil personnalisé avant achat.
        </p>

        {(accessories.length > 0 || otherItems.length > 0) && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" aria-hidden="true" />
              Accessoires
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...accessories, ...otherItems].map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {packs.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Boxes className="h-6 w-6 text-primary" aria-hidden="true" />
              Packs
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packs.map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Recycle className="h-6 w-6 text-primary" aria-hidden="true" />
            PC reconditionnés
          </h2>
          {hasVisiblePcs ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pcs.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <article className="card text-center py-12">
              <Construction className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-2">En construction</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Notre catalogue de PC reconditionnés arrive bientôt. En attendant, contactez-moi
                pour un conseil personnalisé selon votre budget.
              </p>
              <Button asChild variant="outline">
                <Link href="/contact">
                  Me contacter
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </article>
          )}
        </section>

        <section id="reprise" className="scroll-mt-24 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6 text-primary" aria-hidden="true" />
            Reprise &amp; rachat
          </h2>
          <TradeInEstimator />
        </section>

        <div className="text-center card bg-primary/5 border-primary/10">
          <p className="text-gray-700 mb-4">
            Besoin d&apos;un conseil avant achat ? Appelez le{" "}
            <a href={`tel:${CONTACT_PHONE}`} className="text-primary font-semibold hover:underline">
              {CONTACT_PHONE_DISPLAY}
            </a>{" "}
            ou écrivez à{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary font-semibold hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <Button asChild variant="outline">
            <Link href="/contact">
              Formulaire de contact
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
