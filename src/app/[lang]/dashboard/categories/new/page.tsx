import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { CategoryForm } from "@/components/dashboard/category-form";
import { PageHeader } from "@/components/dashboard/page-header";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.adminCategories.new };
}

export default async function NewCategoryPage() {
  const locale = await getLocale();
  const t = (await getDictionary()).adminCategories;
  return (
    <div className="space-y-6">
      <PageHeader title={t.new} />
      <CategoryForm locale={locale} t={t} />
    </div>
  );
}
