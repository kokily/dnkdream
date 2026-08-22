import { PostListItem } from "@/lib/posts";
import CategoryPills from "./category-pills";
import PageHeading from "./page-heading";
import Pagination from "./pagination";
import PostList from "./post-list";
import PostSearch from "./post-search";

export default function PostFeed({
  eyebrow,
  title,
  posts,
  emptyText,
  clearHref,
  categories,
  page,
  pageCount,
  basePath,
  query,
}: {
  eyebrow?: string;
  title: string;
  posts: PostListItem[];
  emptyText: string;
  clearHref?: string;
  categories?: string[];
  page: number;
  pageCount: number;
  basePath: string;
  query: string;
}) {
  return (
    <section>
      {categories ? <CategoryPills categories={categories} /> : null}
      <div className={categories ? "mt-6" : undefined}>
        <PageHeading eyebrow={eyebrow} title={title} clearHref={clearHref} />
      </div>
      <PostList posts={posts} emptyText={emptyText} />
      <div className="mt-10 flex flex-col items-center gap-4">
        <PostSearch basePath={basePath} query={query} />
        <Pagination
          page={page}
          pageCount={pageCount}
          basePath={basePath}
          query={query}
        />
      </div>
    </section>
  );
}
