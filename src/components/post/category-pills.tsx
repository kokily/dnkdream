"use client";

import Link from "next/link";
import { useCategoryPills } from "./hooks/use-category-pills";

interface CategoryPillsProps {
  categories: string[];
}

export default function CategoryPills({ categories }: CategoryPillsProps) {
  const { items, pathname } = useCategoryPills({ categories });

  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((name) => {
        const href = `/category/${encodeURIComponent(name)}`;
        const current = decodeURIComponent(pathname);
        const active = current === `/category/${name}` || pathname === href;

        return (
          <li key={name}>
            <Link
              href={active ? "/" : href}
              className={
                active
                  ? "rounded-full bg-mint px-3 py-1.5 text-sm text-white"
                  : "rounded-full bg-mint-soft/60 px-3 py-1.5 text-sm text-charcoal hover:bg-mint-soft"
              }
            >
              {name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
