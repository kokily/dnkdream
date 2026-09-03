import { notFound } from "next/navigation";
import {
  listPostsByTag,
  pageFromSearchParams,
  queryFromSearchParams,
} from "@/lib/queries/posts";
import PostFeed from "@/components/post/post-feed";

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params;
  const { page: pageParam, q } = await searchParams;

  const name = decodeURIComponent(tag);
  const query = queryFromSearchParams(q);

  const result = await listPostsByTag(
    name,
    pageFromSearchParams(pageParam),
    query,
  );

  if (result.total === 0 && !query) {
    notFound();
  }

  return (
    <PostFeed
      eyebrow="태그"
      title={`#${name}`}
      posts={result.posts}
      emptyText={
        query ? "제목에 맞는 글이 없습니다." : "이 태그에 글이 없습니다"
      }
      clearHref="/"
      page={result.page}
      pageCount={result.pageCount}
      basePath={`/tag/${encodeURIComponent(name)}`}
      query={query}
    />
  );
}
