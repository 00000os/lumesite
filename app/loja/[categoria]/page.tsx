import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "../catalog-data";
import CatalogPage from "./CatalogPage";

export function generateStaticParams() {
  return categories.map((category) => ({ categoria: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }): Promise<Metadata> {
  const { categoria } = await params;
  const category = getCategory(categoria);
  if (!category) return {};
  return {
    title: `${category.name} | Lume Boutique`,
    description: category.description,
  };
}

export default async function StoreCategoryPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const category = getCategory(categoria);
  if (!category) notFound();
  return <CatalogPage initialCategory={category} />;
}
