import { PostListItem } from "@/lib/posts";
import PostCard from "./post-card";

export default function PostList({
  posts,
  emptyText,
}: {
  posts: PostListItem[];
  emptyText: string;
}) {
  if (posts.length === 0) {
    return <p className="mt-12 text-neutral-500">{emptyText}</p>;
  }

  return (
    <div className="mt-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
