import type { Metadata } from "next";
import { Star, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { testimonials, business } from "@/config/content";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Avis clients",
  description:
    "Découvrez les avis clients de VoisinTech, dépannage informatique à domicile à Toulouse. Laissez votre témoignage.",
};

export const dynamic = "force-dynamic";

export default async function AvisPage() {
  let dbReviews: { name: string; rating: number; comment: string; createdAt: Date }[] = [];
  try {
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

  const avgRating =
    allReviews.length > 0
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="text-4xl font-bold mb-4">Avis clients</h1>

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
