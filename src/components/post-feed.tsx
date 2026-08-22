import { PostListItem } from "@/lib/posts";
import CategoryPills from "./category-pills";
import PageHeading from "./page-heading";
import PostList from "./post-list";

export default function PostFeed({
  eyebrow,
  title,
  posts,
  emptyText,
  clearHref,
  categories,
}: {
  eyebrow?: string;
  title: string;
  posts: PostListItem[];
  emptyText: string;
  clearHref?: string;
  categories?: string[];
}) {
  return (
    <section>
      {categories ? <CategoryPills categories={categories} /> : null}
      <div className={categories ? "mt-6" : undefined}>
        <PageHeading eyebrow={eyebrow} title={title} clearHref={clearHref} />
      </div>
      <PostList posts={posts} emptyText={emptyText} />
    </section>
  );
}
