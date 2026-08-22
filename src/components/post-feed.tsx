import { PostListItem } from "@/lib/posts";
import PageHeading from "./page-heading";
import PostList from "./post-list";

export default function PostFeed({
  eyebrow,
  title,
  posts,
  emptyText,
  clearHref,
}: {
  eyebrow?: string;
  title: string;
  posts: PostListItem[];
  emptyText: string;
  clearHref?: string;
}) {
  return (
    <section>
      <PageHeading eyebrow={eyebrow} title={title} clearHref={clearHref} />
      <PostList posts={posts} emptyText={emptyText} />
    </section>
  );
}
