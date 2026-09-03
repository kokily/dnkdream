import type { CommentThread } from "@/lib/queries/comments";
import CommentList from "@/components/comment/comment-list";
import CommentForm from "@/components/comment/comment-form";

interface CommentSectionProps {
  postId: string;
  comments: CommentThread[];
  isAdmin: boolean;
}

export default function CommentSection({
  postId,
  comments,
  isAdmin,
}: CommentSectionProps) {
  return (
    <section className="mx-auto mt-16 max-w-3xl border-t border-line pt-10">
      <h2 className="text-lg font-semibold">댓글 {comments.length}</h2>
      <CommentForm postId={postId} isAdmin={isAdmin} />
      <CommentList postId={postId} comments={comments} isAdmin={isAdmin} />
    </section>
  );
}
