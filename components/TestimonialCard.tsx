"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "@/config/content";
import { Button } from "@/components/ui/button";

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const testimonial = testimonials[current];

  return (
    <section className="section-padding bg-primary/5 pb-8 md:pb-10" aria-label="Témoignages clients">
      <div className="container-page">
        <h2 className="text-3xl font-bold text-center mb-10">
          Ce que disent mes clients
        </h2>

        <div className="max-w-3xl mx-auto">
          <blockquote className="card text-center relative">
            <div className="flex justify-center gap-1 mb-4" aria-label={`Note : ${testimonial.rating} sur 5`}>
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-success text-success" aria-hidden="true" />
              ))}
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              &ldquo;{testimonial.text}&rdquo;
            </p>
            <footer>
              <cite className="not-italic font-semibold text-foreground">
                {testimonial.name}
              </cite>
              <p className="text-gray-500 text-sm">{testimonial.age}</p>
            </footer>
          </blockquote>

          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Sélection de témoignage">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Témoignage ${i + 1}`}
                  className={`h-3 w-3 rounded-full min-h-[12px] min-w-[12px] transition-colors ${
                    i === current ? "bg-primary" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
