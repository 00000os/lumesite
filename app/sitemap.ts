import type { MetadataRoute } from "next";
import { categories } from "./loja/catalog-data";
import { getSiteUrl } from "./site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...categories.map((category) => ({ url: `${base}/loja/${category.slug}`, changeFrequency: "weekly" as const, priority: .8 })),
    ...categories.flatMap((category) => category.products.map((product) => ({ url: `${base}/loja/${category.slug}/produto/${product.id}`, changeFrequency: "weekly" as const, priority: .7 }))),
  ];
}
