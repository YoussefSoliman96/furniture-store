import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/ar/dashboard", "/en/dashboard", "/ar/cart", "/en/cart", "/ar/account", "/en/account"] },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
