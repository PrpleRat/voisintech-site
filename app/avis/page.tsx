import type { Metadata } from "next";
import { Star, ExternalLink } from "lucide-react";
import { getPrisma } from "@/lib/prisma";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { testimonials, business } from "@/config/content";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Avis clients VoisinTech — Dépannage informatique Toulouse",
  description:
    "Avis clients VoisinTech : dépannage informatique à domicile à Toulouse. Témoignages seniors et familles. Laissez votre avis.",
  path: "/avis",
});

export const dynamic = "force-dynamic";

export default async function AvisPage() {
  let dbReviews: { name: string; rating: number; comment: string; createdAt: Date }[] = [];
  try {
    const prisma = await getPrisma();
    dbReviews = await prisma.review.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // DB may not be initialized yet
  }

  const allReviews = [
    ...dbReviews.map((r) => ({
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt.toLocaleDateString("fr-FR"),
    })),
    ...testimonials.map((t) => ({
      name: t.name,
      rating: t.rating,
      comment: t.text,
      date: undefined as string | undefined,
    })),
  ];

  const avgNum = allReviews.length > 0
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    : 5;
  const avgRating = avgNum.toFixed(1);

  const reviewSchema = {
    "@context": "https://schema.org",
    "@id": `${business.website}/#localbusiness`,
    name: business.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgNum.toFixed(1),
      reviewCount: allReviews.length,
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <div className="section-padding">
      <JsonLd data={reviewSchema} />
      <div className="container-page">
        <h1 className="text-4xl font-bold mb-4">
          Avis clients VoisinTech — Toulouse
        </h1>

        <div className="flex items-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-primary">{avgRating}</span>
            <div>
              <div className="flex gap-1" aria-label={`Note moyenne : ${avgRating} sur 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(Number(avgRating))
                        ? "fill-success text-success"
                        : "text-gray-300"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">{allReviews.length} avis</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <a
              href={business.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Avis Google
            </a>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {allReviews.map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
        </div>

        <div className="max-w-xl mx-auto">
          <ReviewForm />
        </div>
      </div>
    </div>
  );
}
