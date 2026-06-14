import type { Metadata } from "next";
import { business } from "@/config/content";

const DEFAULT_OG_IMAGE = "/opengraph-image.png";

export const defaultKeywords = [
  "voisintech",
  "VoisinTech",
  "dépannage informatique Toulouse",
  "depannage informatique toulouse",
  "réparation ordinateur domicile Toulouse",
  "technicien informatique Toulouse",
  "aide seniors numérique",
  "dépannage PC Blagnac",
  "aide informatique Colomiers",
];

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${business.website}${normalized === "/" ? "" : normalized}`;
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(opts.path);
  const fullTitle = opts.title.includes(business.name)
    ? opts.title
    : `${opts.title} | ${business.name}`;

  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords ?? defaultKeywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url,
      siteName: business.name,
      title: fullTitle,
      description: opts.description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${business.name} — dépannage informatique Toulouse`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function faqJsonLd(
  items: { question: string; answer: string }[],
  pageUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    url: pageUrl,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
