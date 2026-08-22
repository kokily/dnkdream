import Link from "next/link";

export default function PageHeading({
  eyebrow,
  title,
  description,
  clearHref,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  clearHref?: string;
}) {
  return (
    <header className="space-y-3">
      {eyebrow ? (
        <p className="text-sm font-medium text-mint">{eyebrow}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {clearHref ? (
          <Link
            href={clearHref}
            className="rounded-md border border-line px-3 py-1.5 text-sm text-neutral-600 hover:border-mint hover:text-mint"
          >
            취소
          </Link>
        ) : null}
      </div>
      {description ? (
        <p className="max-w-2xl text-neutral-600">{description}</p>
      ) : null}
    </header>
  );
}
