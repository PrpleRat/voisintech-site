"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReviews = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const moderate = async (id: string, status: string) => {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-status", type: "review", id, status }),
    });
    loadReviews();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pending = reviews.filter((r) => r.status === "pending");

  return (
    <div className="section-padding">
      <div className="container-page">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Modération des avis</h1>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">← Tableau de bord</Link>
          </Button>
        </div>

        <h2 className="text-xl font-semibold mb-4">
          En attente ({pending.length})
        </h2>

        <div className="space-y-4 mb-12">
          {pending.map((review) => (
            <div key={review.id} className="card">
              <div className="flex gap-1 mb-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-success text-success" aria-hidden="true" />
                ))}
              </div>
              <p className="font-bold">{review.name}</p>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(review.createdAt).toLocaleDateString("fr-FR")}
              </p>
              <p className="text-gray-700 mb-4">{review.comment}</p>
              <div className="flex gap-3">
                <Button size="sm" onClick={() => moderate(review.id, "approved")}>
                  Approuver
                </Button>
                <Button size="sm" variant="outline" onClick={() => moderate(review.id, "rejected")}>
                  Rejeter
                </Button>
              </div>
            </div>
          ))}
          {pending.length === 0 && (
            <p className="text-gray-500">Aucun avis en attente.</p>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Tous les avis</h2>
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-center justify-between p-4 bg-white rounded-xl border">
              <div>
                <span className="font-semibold">{review.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  — {review.status === "approved" ? "Approuvé" : review.status === "rejected" ? "Rejeté" : "En attente"}
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-success text-success" aria-hidden="true" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
