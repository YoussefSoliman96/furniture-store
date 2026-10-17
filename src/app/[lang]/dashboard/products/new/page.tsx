import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getAdminCategories } from "@/lib/data/admin";
import { ProductForm } from "@/components/dashboard/product-form";
import { PageHeader } from "@/components/dashboard/page-header";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.adminProducts.new };
}

export default async function NewProductPage({ searchParams }: PageProps<"/[lang]/dashboard/products/new">) {
  const { from, category } = await searchParams;
  const locale = await getLocale();
  const t = (await getDictionary()).adminProducts;
  const categories = await getAdminCategories();
  return (
    <div className="space-y-6">
      <PageHeader title={t.new} />
      <ProductForm
        locale={locale}
        t={t}
        categories={categories}
        from={from === "inventory" ? "inventory" : "products"}
        defaultCategoryId={typeof category === "string" ? category : undefined}
      />
    </div>
  );
}
