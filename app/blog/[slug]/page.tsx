import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogArticles, getArticleBySlug } from "@/config/blog";
import { business } from "@/config/content";
import { CallButton } from "@/components/CallButton";
import { Button } from "@/components/ui/button";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${business.website}/blog/${article.slug}` },
  };
}

function renderParagraph(text: string) {
  if (text.startsWith("**") && text.includes("**")) {
    const parts = text.split("**");
    return (
      <p className="text-gray-700 leading-relaxed mb-4">
        <strong>{parts[1]}</strong>
        {parts[2]}
      </p>
    );
  }
  return <p className="text-gray-700 leading-relaxed mb-4">{text}</p>;
}

export default function BlogArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { "@type": "Organization", name: business.name },
  };

  return (
    <article className="section-padding">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container-page max-w-3xl">
        <Link href="/blog" className="text-primary text-sm hover:underline mb-4 inline-block">
          ← Blog & FAQ
        </Link>
        <p className="text-sm text-gray-500 mb-2">
          {new Date(article.date).toLocaleDateString("fr-FR")} — {article.readTime}
        </p>
        <h1 className="text-4xl font-bold mb-8">{article.title}</h1>
        <div className="prose prose-lg max-w-none">
          {article.content.map((p, i) => (
            <div key={i}>{renderParagraph(p)}</div>
          ))}
        </div>
        <div className="mt-12 p-6 bg-primary/5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <p className="font-semibold flex-1">Besoin d&apos;aide à domicile à Toulouse ?</p>
          <Button asChild>
            <Link href="/devis">Devis gratuit</Link>
          </Button>
          <CallButton size="default" />
        </div>
      </div>
    </article>
  );
}
