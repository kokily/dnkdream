"use client";

import { useActionState } from "react";
import { createCommentAction } from "@/lib/actions/comments";

export default function CommentForm({
  postId,
  parentId,
  isAdmin,
}: {
  postId: string;
  parentId?: string;
  isAdmin: boolean;
}) {
  const [error, formAction, pending] = useActionState(
    createCommentAction,
    null,
  );

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <input type="hidden" name="postId" value={postId} />
      {parentId ? (
        <input type="hidden" name="parentId" value={parentId} />
      ) : null}

      {!isAdmin && (
        <div className="flex flex-wrap gap-3">
          <input
            name="username"
            required
            maxLength={20}
            placeholder="이름"
            className="w-36 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
          />
          <input
            name="password"
            type="password"
            required
            minLength={4}
            placeholder="비밀번호"
            className="w-36 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
          />
        </div>
      )}

      <textarea
        name="body"
        required
        maxLength={2000}
        rows={parentId ? 3 : 4}
        placeholder={parentId ? "답글을 작성하세요" : "댓글을 작성하세요"}
        className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-charcoal px-4 py-2 text-sm text-white hover:bg-ink disabled:opacity-60"
      >
        {pending ? "등록 중..." : parentId ? "답글 등록" : "댓글 등록"}
      </button>
    </form>
  );
}
