import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { dashboardSections, isDashboardSection } from "@/components/dashboard/sections";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export function generateStaticParams() {
  return dashboardSections.map((section) => ({ section }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/dashboard/[section]">) {
  const { section } = await params;
  if (!isDashboardSection(section)) notFound();
  const t = await getDictionary();
  return { title: t.dashboard[section] };
}

export default async function DashboardSectionPage({ params }: PageProps<"/[lang]/dashboard/[section]">) {
  const { section } = await params;
  if (!isDashboardSection(section)) notFound();
  const t = await getDictionary();
  return <SectionPlaceholder title={t.dashboard[section]} />;
}
