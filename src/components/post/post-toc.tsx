import { TocItem } from "@/lib/markdown";

export default function PostToc({
  items,
  aside = false,
}: {
  items: TocItem[];
  aside?: boolean;
}) {
  if (items.length === 0) return null;

  if (aside) {
    return (
      <nav aria-label="목차" className="border-l border-line pl-3.5">
        <ol className="space-y-1.5 text-[13px] leading-snug">
          {items.map((item) => (
            <li key={item.id} className={item.depth === 3 ? "pl-3" : undefined}>
              <a
                href={`#${item.id}`}
                className="text-neutral-500 hover:text-mint"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <nav
      aria-label="목차"
      className="mt-8 rounded-xl border border-line bg-white/70 p-4"
    >
      <p className="text-sm font-semibold text-charcoal">목차</p>
      <ol className="mt-3 space-y-1.5 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? "pl-4" : undefined}>
            <a
              href={`#${item.id}`}
              className="text-neutral-600 hover:text-mint"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
