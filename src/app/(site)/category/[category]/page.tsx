import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostFeed from "@/components/post-feed";
import { listCategories, listPostsByCategory } from "@/lib/posts";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return { title: decodeURIComponent(category) };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const name = decodeURIComponent(category);
  const [posts, categories] = await Promise.all([
    listPostsByCategory(name),
    listCategories(),
  ]);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <PostFeed
      title={name}
      posts={posts}
      emptyText="이 카테고리에 글이 없습니다."
      clearHref="/"
      categories={categories}
    />
  );
}
