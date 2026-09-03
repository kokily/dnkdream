import { usePathname } from "next/navigation";

interface CategoryPillsProps {
  categories: string[];
}

export function useCategoryPills({ categories }: CategoryPillsProps) {
  const pathname = usePathname();
  const items = [...categories].sort((a, b) => a.localeCompare(b, "ko"));

  return {
    items,
    pathname,
  };
}
