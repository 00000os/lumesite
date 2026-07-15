import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "../../../catalog-data";
import CatalogPage from "../../CatalogPage";
import { getSiteUrl } from "../../../../site-url";

export function generateStaticParams() {
  return categories.flatMap((category) => category.products.map((product) => ({ categoria: category.slug, produto: product.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string; produto: string }> }): Promise<Metadata> {
  const { categoria, produto } = await params;
  const category = getCategory(categoria);
  const item = category?.products.find((product) => product.id === produto);
  if (!category || !item) return {};
  return { title: `${item.name} | Lume Boutique`, description: item.description, openGraph: { title: item.name, description: item.description, images: [category.sheet] } };
}

export default async function ProductPage({ params }: { params: Promise<{ categoria: string; produto: string }> }) {
  const { categoria, produto } = await params;
  const category = getCategory(categoria);
  const item = category?.products.find((product) => product.id === produto);
  if (!category || !item) notFound();
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    image: category.sheet,
    description: item.description,
    sku: item.id,
    brand: { "@type": "Brand", name: item.brand || "Lume" },
    color: item.colors?.join(", "),
    size: item.sizes?.join(", "),
    offers: { "@type": "Offer", priceCurrency: "BRL", price: item.price, availability: "https://schema.org/InStock", url: `${getSiteUrl()}/loja/${categoria}/produto/${produto}` },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} /><CatalogPage initialCategory={category} initialProductId={produto} /></>;
}
