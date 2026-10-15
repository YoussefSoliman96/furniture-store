import {
  Armchair,
  Archive,
  Baby,
  BedDouble,
  Briefcase,
  Flower2,
  Lamp,
  Sofa,
  Trees,
  Tv,
  UtensilsCrossed,
  type LucideProps,
} from "lucide-react";

/** Icons admins can assign to a category. Keys are stored in categories.icon. */
export const categoryIcons = {
  sofa: Sofa,
  armchair: Armchair,
  bed: BedDouble,
  dining: UtensilsCrossed,
  kids: Baby,
  tv: Tv,
  office: Briefcase,
  storage: Archive,
  lamp: Lamp,
  decor: Flower2,
  outdoor: Trees,
} as const;

export type CategoryIconKey = keyof typeof categoryIcons;

export const isCategoryIcon = (value: string): value is CategoryIconKey => value in categoryIcons;

export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = isCategoryIcon(name) ? categoryIcons[name] : Sofa;
  return <Icon aria-hidden {...props} />;
}
