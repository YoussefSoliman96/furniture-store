import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getAdminCategory } from "@/lib/data/admin";
import { CategoryForm } from "@/components/dashboard/category-form";
import { PageHeader } from "@/components/dashboard/page-header";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.adminCategories.edit };
}

export default async function EditCategoryPage({ params }: PageProps<"/[lang]/dashboard/categories/[id]">) {
  const { id } = await params;
  const category = await getAdminCategory(id);
  if (!category) notFound();
  const locale = await getLocale();
  const t = (await getDictionary()).adminCategories;
  return (
    <div className="space-y-6">
      <PageHeader title={t.edit} />
      <CategoryForm locale={locale} t={t} category={category} />
    </div>
  );
}
