import type { Metadata } from "next";
import Link from "next/link";
import { blogArticles } from "@/config/blog";
import { faq } from "@/config/content";
import { FAQAccordion } from "@/components/FAQAccordion";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog & FAQ — Conseils dépannage informatique Toulouse",
  description:
    "Guides VoisinTech : PC lent, arnaques, Wi-Fi, aide seniors, démarches en ligne. Conseils dépannage informatique à Toulouse.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Blog & conseils</h1>
        <p className="text-lg text-gray-600 mb-12">
          Des articles simples pour mieux comprendre vos problèmes informatiques.
        </p>

        <div className="space-y-6 mb-16">
          {blogArticles.map((article) => (
            <article key={article.slug} className="card">
              <p className="text-sm text-gray-500 mb-2">
                {new Date(article.date).toLocaleDateString("fr-FR")} — {article.readTime}
              </p>
              <h2 className="text-2xl font-bold mb-2">
                <Link href={`/blog/${article.slug}`} className="hover:text-primary">
                  {article.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <Link href={`/blog/${article.slug}`} className="text-primary font-semibold hover:underline">
                Lire l&apos;article →
              </Link>
            </article>
          ))}
        </div>

        <section>
          <h2 className="text-3xl font-bold mb-6">Questions fréquentes</h2>
          <FAQAccordion items={faq} />
        </section>
      </div>
    </div>
  );
}
