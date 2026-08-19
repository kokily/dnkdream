"use client";

import { useActionState, useMemo, useState } from "react";
import { marked } from "marked";
import { createPostAction } from "@/lib/actions/posts";
import DOMPurify from "isomorphic-dompurify";

marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function WriteForm() {
  const [error, formAction, pending] = useActionState(createPostAction, null);
  const [body, setBody] = useState("");

  const preview = useMemo(() => {
    return DOMPurify.sanitize(marked.parse(body, { async: false }) as string);
  }, [body]);

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
        <input
          name="category"
          required
          placeholder="카테고리"
          className="w-36 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
        />
        <input
          name="title"
          required
          placeholder="제목"
          className="min-w-60 flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
        />
        <input
          name="tags"
          required
          placeholder="태그, 쉼표로 구분"
          className="min-w-48 flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-charcoal px-4 py-2 text-sm text-white hover:bg-ink disabled:opacity-60"
        >
          {pending ? "저장 중..." : "발행"}
        </button>
      </div>

      {error && (
        <p className="border-b border-line px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid min-h-0 flex-1 md:grid-cols-2">
        <textarea
          name="body"
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="마크다운으로 작성하세요"
          className="min-h-[60vh] resize-none border-r border-line bg-white p-4 font-mono outline-none"
        />
        <div
          className="markdown min-h-[60vh] overflow-auto p-4"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </div>
    </form>
  );
}
