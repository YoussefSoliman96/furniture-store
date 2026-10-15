import { CategoryIcon } from "@/components/ui/category-icon";

// Warm brand-adjacent tints so a grid of placeholders doesn't look uniform.
const tints = [
  "from-[#f3e3d3] to-[#e7cdb4] dark:from-[#2b2018] dark:to-[#3a2b1f]",
  "from-[#efe6dc] to-[#dccab7] dark:from-[#27201a] dark:to-[#352a20]",
  "from-[#f6e9df] to-[#ead3c2] dark:from-[#2d211a] dark:to-[#3d2c22]",
  "from-[#ece4d8] to-[#d9c8b0] dark:from-[#25201a] dark:to-[#332b21]",
];

/** Placeholder product photo until real images are uploaded. */
export function ProductImage({ icon, seed, className = "" }: { icon: string; seed: string; className?: string }) {
  const tint = tints[[...seed].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % tints.length];
  return (
    <div className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${tint} ${className}`}>
      <CategoryIcon name={icon} strokeWidth={1.25} className="size-1/3 text-primary/70" />
    </div>
  );
}
