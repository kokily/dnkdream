import CommentForm from "@/components/comment-form";
import CommentList from "@/components/comment-list";
import type { CommentThread } from "@/lib/comments";

export default function CommentSection({
  postId,
  comments,
  isAdmin,
}: {
  postId: string;
  comments: CommentThread[];
  isAdmin: boolean;
}) {
  return (
    <section className="mx-auto mt-16 max-w-3xl border-t border-line pt-10">
      <h2 className="text-lg font-semibold">댓글 {comments.length}</h2>
      <CommentForm postId={postId} isAdmin={isAdmin} />
      <CommentList postId={postId} comments={comments} isAdmin={isAdmin} />
    </section>
  );
}
