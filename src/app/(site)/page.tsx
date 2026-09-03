import PostFeed from "@/components/post/post-feed";
import {
  listCategories,
  listPosts,
  pageFromSearchParams,
  queryFromSearchParams,
} from "@/lib/queries/posts";

interface HomePageProps {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: pageParam, q } = await searchParams;
  const query = queryFromSearchParams(q);

  const [result, categories] = await Promise.all([
    listPosts(pageFromSearchParams(pageParam), query),
    listCategories(),
  ]);

  return (
    <PostFeed
      title="개발과 일상을 기록합니다"
      posts={result.posts}
      emptyText={
        query ? "제목에 맞는 글이 없습니다." : "아직 작성된 글이 없습니다."
      }
      categories={categories}
      page={result.page}
      pageCount={result.pageCount}
      basePath="/"
      query={query}
    />
  );
}
