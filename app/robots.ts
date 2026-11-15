import type { MetadataRoute } from "next";
import { portfolio } from "@/config/portfolio";

export default function robots(): MetadataRoute.Robots {
  if (!portfolio.siteUrl) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(portfolio.siteUrl ? { sitemap: `${portfolio.siteUrl}/sitemap.xml` } : {}),
  };
}
