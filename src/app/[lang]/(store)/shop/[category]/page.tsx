import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { categories, categoryHref, type CategorySlug } from "@/config/navigation";
import { PagePlaceholder, pageMetadata } from "@/components/store/page-placeholder";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

const isCategory = (value: string): value is CategorySlug =>
  (categories as readonly string[]).includes(value);

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const t = await getDictionary();
  return pageMetadata(t.categories[category], categoryHref(category));
}

export default async function Page({ params }: PageProps<"/[lang]/shop/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const t = await getDictionary();
  return <PagePlaceholder title={t.categories[category]} />;
}
