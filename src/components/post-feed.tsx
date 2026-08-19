import { PostListItem } from "@/lib/posts";
import PageHeading from "./page-heading";
import PostList from "./post-list";

export default function PostFeed({
  eyebrow,
  title,
  posts,
  emptyText,
}: {
  eyebrow?: string;
  title: string;
  posts: PostListItem[];
  emptyText: string;
}) {
  return (
    <section>
      <PageHeading eyebrow={eyebrow} title={title} />
      <PostList posts={posts} emptyText={emptyText} />
    </section>
  );
}
