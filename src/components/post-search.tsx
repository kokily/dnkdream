export default function PostSearch({
  basePath,
  query,
}: {
  basePath: string;
  query: string;
}) {
  return (
    <form action={basePath} method="get" className="flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={query}
        placeholder="제목 검색"
        className="w-52 rounded-md border border-line px-3 py-1.5 text-sm outline-none focus:border-mint"
      />
      <button
        type="submit"
        className="rounded-md border border-line px-3 py-1.5 text-sm hover:border-mint hover:text-mint"
      >
        검색
      </button>
    </form>
  );
}
