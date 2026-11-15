import type { MetadataRoute } from "next";
import { portfolio } from "@/config/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!portfolio.siteUrl) return [];
  return [{ url: portfolio.siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
