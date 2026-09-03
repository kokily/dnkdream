import { useEffect, useState } from "react";
import { TocItem } from "@/lib/shared/markdown";

interface UsePostTocProps {
  items: TocItem[];
}

export function usePostToc({ items }: UsePostTocProps) {
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

  return {
    activeId,
  };
}
