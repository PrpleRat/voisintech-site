import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  rating: number;
  comment: string;
  date?: string;
}

export function ReviewCard({ name, rating, comment, date }: TestimonialCardProps) {
  return (
    <article className="card">
      <div className="flex gap-1 mb-3" aria-label={`Note : ${rating} sur 5`}>
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-success text-success" aria-hidden="true" />
        ))}
      </div>
      <p className="text-gray-700 leading-relaxed mb-4">&ldquo;{comment}&rdquo;</p>
      <footer className="flex justify-between items-center text-sm">
        <cite className="not-italic font-semibold">{name}</cite>
        {date && <time className="text-gray-500">{date}</time>}
      </footer>
    </article>
  );
}
