import type { MetadataRoute } from "next";
import { business } from "@/config/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${business.website}/sitemap.xml`,
  };
}
