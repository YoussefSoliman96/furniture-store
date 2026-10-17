import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { loc } from "@/lib/format";
import { getAdminCategories, getAdminProduct } from "@/lib/data/admin";
import { ProductForm } from "@/components/dashboard/product-form";
import { PageHeader } from "@/components/dashboard/page-header";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.adminProducts.edit };
}

export default async function EditProductPage({ params, searchParams }: PageProps<"/[lang]/dashboard/products/[id]">) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);
  const [product, categories] = await Promise.all([getAdminProduct(id), getAdminCategories()]);
  if (!product) notFound();
  const locale = await getLocale();
  const t = (await getDictionary()).adminProducts;
  return (
    <div className="space-y-6">
      <PageHeader title={t.edit} intro={`${loc(locale, product.nameAr, product.nameEn)} · ${product.sku}`} />
      <ProductForm
        locale={locale}
        t={t}
        categories={categories}
        product={product}
        from={from === "inventory" ? "inventory" : "products"}
      />
    </div>
  );
}
