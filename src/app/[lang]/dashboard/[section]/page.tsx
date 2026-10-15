import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isPlaceholderSection, placeholderSections } from "@/components/dashboard/sections";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export function generateStaticParams() {
  return placeholderSections.map((section) => ({ section }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/dashboard/[section]">) {
  const { section } = await params;
  if (!isPlaceholderSection(section)) notFound();
  const t = await getDictionary();
  return { title: t.dashboard[section] };
}

export default async function DashboardSectionPage({ params }: PageProps<"/[lang]/dashboard/[section]">) {
  const { section } = await params;
  if (!isPlaceholderSection(section)) notFound();
  const t = await getDictionary();
  return <SectionPlaceholder title={t.dashboard[section]} />;
}
