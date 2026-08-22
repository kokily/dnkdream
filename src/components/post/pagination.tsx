import Link from "next/link";

function hrefForPage(basePath: string, page: number, query: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function Pagination({
  page,
  pageCount,
  basePath,
  query,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  query: string;
}) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav
      aria-label="페이지"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={hrefForPage(basePath, page - 1, query)}
          className="rounded-md border border-line px-3 py-1.5 text-sm hover:border-mint hover:text-mint"
        >
          이전
        </Link>
      ) : (
        <span className="rounded-md border border-transparent px-3 py-1.5 text-sm text-neutral-400">
          이전
        </span>
      )}

      {pages.map((item) => (
        <Link
          key={item}
          href={hrefForPage(basePath, item, query)}
          aria-current={item === page ? "page" : undefined}
          className={
            item === page
              ? "rounded-md border border-mint px-3 py-1.5 text-sm text-mint"
              : "rounded-md border border-line px-3 py-1.5 text-sm hover:border-mint hover:text-mint"
          }
        >
          {item}
        </Link>
      ))}

      {page < pageCount ? (
        <Link
          href={hrefForPage(basePath, page + 1, query)}
          className="rounded-md border border-line px-3 py-1.5 text-sm hover:border-mint hover:text-mint"
        >
          다음
        </Link>
      ) : (
        <span className="rounded-md border border-transparent px-3 py-1.5 text-sm text-neutral-400">
          다음
        </span>
      )}
    </nav>
  );
}
