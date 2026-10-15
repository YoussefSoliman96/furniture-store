import { getDictionary } from "@/i18n/dictionaries";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.dashboard.overview };
}

export default async function DashboardOverview() {
  const t = await getDictionary();
  return <SectionPlaceholder title={t.dashboard.overview} stats />;
}
