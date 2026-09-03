import { auth } from "@/auth";
import { PostListItem } from "@/lib/queries/posts";
import PageHeading from "@/components/site/page-heading";
import CategoryPills from "./category-pills";
import PostSearch from "./post-search";
import PostList from "./post-list";
import Pagination from "./pagination";

interface PostFeedProps {
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
}

export default async function PostFeed({
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
}: PostFeedProps) {
  const session = await auth();
  const isAdmin = !!session?.user;

  return (
    <section>
      {categories ? <CategoryPills categories={categories} /> : null}
      <div className={categories ? "mt-6" : undefined}>
        <PageHeading eyebrow={eyebrow} title={title} clearHref={clearHref} />
      </div>
      <PostList posts={posts} emptyText={emptyText} isAdmin={isAdmin} />
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
