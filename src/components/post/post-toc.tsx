"use client";

import { TocItem } from "@/lib/shared/markdown";
import { usePostToc } from "./hooks/use-post-toc";

interface PostTocProps {
  items: TocItem[];
  aside?: boolean;
}

export default function PostToc({ items, aside = false }: PostTocProps) {
  const { activeId } = usePostToc({ items });

  if (items.length === 0) return null;

  const list = (
    <ol
      className={
        aside
          ? "space-y-1.5 text-[13px] leading-snug"
          : "mt-3 space-y-1.5 text-sm"
      }
    >
      {items.map((item) => (
        <li
          key={item.id}
          className={item.depth === 3 ? (aside ? "pl-3" : "pl-4") : undefined}
        >
          <a
            href={`#${item.id}`}
            className={`toc-link${activeId === item.id ? " is-active" : ""}`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );

  if (aside) {
    return (
      <nav aria-label="목차" className="border-l border-line pl-3.5">
        {list}
      </nav>
    );
  }

  return (
    <nav
      aria-label="목차"
      className="mt-8 rounded-xl border border-line bg-white/70 p-4"
    >
      <p className="text-sm font-semibold text-charcoal">목차</p>
      {list}
    </nav>
  );
}
