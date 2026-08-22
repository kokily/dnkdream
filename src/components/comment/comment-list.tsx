"use client";

import { useState } from "react";
import { deleteCommentAction } from "@/lib/actions/comments";
import { formatDate } from "@/lib/format-date";
import type { CommentThread } from "@/lib/comments";
import CommentForm from "@/components/comment/comment-form";

type Item = CommentThread | CommentThread["replies"][number];

function CommentItem({
  comment,
  postId,
  isAdmin,
  isReply,
}: {
  comment: Item;
  postId: string;
  isAdmin: boolean;
  isReply?: boolean;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <li
      className={
        isReply
          ? "mt-4 border-l-2 border-line pl-4"
          : "border-b border-line py-5"
      }
    >
      <p className="text-sm font-medium">{comment.username}</p>
      <p className="mt-1 text-xs text-neutral-500">
        {formatDate(comment.createdAt)}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">
        {comment.deleted ? "삭제된 댓글입니다." : comment.body}
      </p>

      {!comment.deleted && (
        <div className="mt-3 flex gap-3 text-sm">
          {!isReply && (
            <button
              type="button"
              onClick={() => setReplyOpen((open) => !open)}
              className="text-mint hover:underline"
            >
              답글
            </button>
          )}
          <button
            type="button"
            onClick={() => setDeleteOpen((open) => !open)}
            className="text-neutral-500 hover:text-red-600"
          >
            삭제
          </button>
        </div>
      )}

      {replyOpen && !isReply && (
        <CommentForm postId={postId} parentId={comment.id} isAdmin={isAdmin} />
      )}

      {deleteOpen && !comment.deleted && (
        <form
          action={deleteCommentAction}
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <input type="hidden" name="id" value={comment.id} />
          {!isAdmin && (
            <input
              name="password"
              type="password"
              required
              placeholder="비밀번호"
              className="w-36 rounded-md border border-line px-3 py-1.5 text-sm outline-none focus:border-mint"
            />
          )}
          <button
            type="submit"
            className="rounded-md border border-line px-3 py-1.5 text-sm hover:border-red-400 hover:text-red-600"
          >
            확인
          </button>
        </form>
      )}

      {"replies" in comment && comment.replies.length > 0 && (
        <ul className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              isAdmin={isAdmin}
              isReply
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CommentList({
  postId,
  comments,
  isAdmin,
}: {
  postId: string;
  comments: CommentThread[];
  isAdmin: boolean;
}) {
  if (comments.length === 0) {
    return (
      <p className="mt-6 text-sm text-neutral-500">아직 댓글이 없습니다.</p>
    );
  }

  return (
    <ul className="mt-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          isAdmin={isAdmin}
        />
      ))}
    </ul>
  );
}
