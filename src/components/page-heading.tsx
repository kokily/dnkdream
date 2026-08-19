export default function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="space-y-3">
      {eyebrow ? (
        <p className="text-sm font-medium text-mint">{eyebrow}</p>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-neutral-600">{description}</p>
      ) : null}
    </header>
  );
}
