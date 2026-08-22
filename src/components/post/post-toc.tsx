"use client";

import { useEffect, useState } from "react";
import { TocItem } from "@/lib/markdown";

export default function PostToc({
  items,
  aside = false,
}: {
  items: TocItem[];
  aside?: boolean;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => !!el);

    if (headings.length === 0) return;

    const visible = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry);
        }

        const current = headings.find((heading) => {
          const entry = visible.get(heading.id);
          return entry?.isIntersecting;
        });

        if (current) setActiveId(current.id);
      },
      {
        rootMargin: "-80px 0px -65% 0px",
        threshold: [0, 1],
      },
    );

    for (const heading of headings) observer.observe(heading);

    return () => observer.disconnect();
  }, [items]);

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
