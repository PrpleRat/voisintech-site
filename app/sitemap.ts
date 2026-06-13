import type { MetadataRoute } from "next";
import { business } from "@/config/content";
import { cities } from "@/config/cities";
import { blogArticles } from "@/config/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = business.website;
  const staticPages = [
    "",
    "/services",
    "/devis",
    "/avis",
    "/a-propos",
    "/contact",
    "/blog",
    "/villes",
    "/mentions-legales",
    "/politique-confidentialite",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...cities.map((city) => ({
      url: `${base}/villes/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...blogArticles.map((article) => ({
      url: `${base}/blog/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
