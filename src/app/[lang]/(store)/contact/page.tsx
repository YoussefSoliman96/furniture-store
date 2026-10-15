import { getDictionary } from "@/i18n/dictionaries";
import { PagePlaceholder, pageMetadata } from "@/components/store/page-placeholder";

export async function generateMetadata() {
  const t = await getDictionary();
  return pageMetadata(t.nav.contact, "/contact");
}

export default async function Page() {
  const t = await getDictionary();
  return <PagePlaceholder title={t.nav.contact} />;
}
