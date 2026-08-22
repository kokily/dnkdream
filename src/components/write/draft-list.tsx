import Link from "next/link";
import { deleteDraftAction } from "@/lib/actions/posts";
import { formatDate } from "@/lib/format-date";
import type { listDrafts } from "@/lib/posts";

type Draft = Awaited<ReturnType<typeof listDrafts>>[number];

export default function DraftList({ drafts }: { drafts: Draft[] }) {
  if (drafts.length === 0) {
    return <p className="p-6 text-neutral-500">임시 저장된 글이 없습니다.</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {drafts.map((draft) => (
        <li
          key={draft.id}
          className="flex items-center justify-between gap-4 px-6 py-4"
        >
          <Link href={`/write/${draft.id}`} className="min-w-0 hover:text-mint">
            <p className="truncate font-medium">{draft.title || "제목 없음"}</p>
            <p className="mt-1 text-sm text-neutral-500">
              {draft.category || "카테고리 없음"} ·{" "}
              {formatDate(draft.updatedAt)}
            </p>
          </Link>
          <form action={deleteDraftAction}>
            <input type="hidden" name="id" value={draft.id} />
            <button
              type="submit"
              className="text-sm text-neutral-500 hover:text-red-600"
            >
              삭제
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
