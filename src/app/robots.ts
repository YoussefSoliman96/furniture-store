import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { storefrontEnabled } from "@/lib/site-mode";

export default function robots(): MetadataRoute.Robots {
  // Dashboard-only deployments have nothing public to index.
  if (!storefrontEnabled()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/ar/dashboard", "/en/dashboard", "/ar/cart", "/en/cart", "/ar/account", "/en/account"] },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
