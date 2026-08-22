import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostFeed from "@/components/post/post-feed";
import {
  listCategories,
  listPostsByCategory,
  pageFromSearchParams,
  queryFromSearchParams,
} from "@/lib/posts";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return { title: decodeURIComponent(category) };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const { page: pageParam, q } = await searchParams;
  const name = decodeURIComponent(category);
  const query = queryFromSearchParams(q);
  const [result, categories] = await Promise.all([
    listPostsByCategory(name, pageFromSearchParams(pageParam), query),
    listCategories(),
  ]);

  if (result.total === 0 && !query) {
    notFound();
  }

  return (
    <PostFeed
      title={name}
      posts={result.posts}
      emptyText={
        query ? "제목에 맞는 글이 없습니다." : "이 카테고리에 글이 없습니다."
      }
      clearHref="/"
      categories={categories}
      page={result.page}
      pageCount={result.pageCount}
      basePath={`/category/${encodeURIComponent(name)}`}
      query={query}
    />
  );
}
