import PostFeed from "@/components/post-feed";
import { listPostsByTag } from "@/lib/posts";
import { notFound } from "next/navigation";

type tagPageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: tagPageProps) {
  const { tag } = await params;

  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage({ params }: tagPageProps) {
  const { tag } = await params;
  const name = decodeURIComponent(tag);
  const posts = await listPostsByTag(name);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <PostFeed
      eyebrow="태그"
      title={`#${name}`}
      posts={posts}
      emptyText="이 태그에 글이 없습니다"
      clearHref="/"
    />
  );
}
