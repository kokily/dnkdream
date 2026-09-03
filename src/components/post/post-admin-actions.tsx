"use client";

import Link from "next/link";
import { deletePostAction } from "@/lib/actions/posts";

interface PostAdminActionsProps {
  postId: string;
}

export default function PostAdminActions({ postId }: PostAdminActionsProps) {
  return (
    <div className="mt-4 flex gap-2">
      <Link
        href={`/write/${postId}`}
        className="inline-flex rounded-md border border-line px-3 py-1.5 text-sm text-charcoal hover:border-mint hover:text-mint"
      >
        수정
      </Link>
      <form
        action={deletePostAction}
        onSubmit={(event) => {
          if (!confirm("이 글을 삭제할까요?")) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={postId} />
        <button
          type="submit"
          className="inline-flex rounded-md border border-line px-3 py-1.5 text-sm text-charcoal hover:border-red-400 hover:text-red-600"
        >
          삭제
        </button>
      </form>
    </div>
  );
}
