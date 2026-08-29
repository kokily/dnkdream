import { PostListItem } from "@/lib/posts";
import PostCard from "./post-card";

export default function PostList({
  posts,
  emptyText,
  isAdmin = false,
}: {
  posts: PostListItem[];
  emptyText: string;
  isAdmin?: boolean;
}) {
  if (posts.length === 0) {
    return <p className="mt-12 text-neutral-500">{emptyText}</p>;
  }

  return (
    <div className="mt-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} isAdmin={isAdmin} />
      ))}
    </div>
  );
}
