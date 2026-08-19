import PostFeed from "@/components/post-feed";
import { listPosts } from "@/lib/posts";

export default async function HomePage() {
  const posts = await listPosts();

  return (
    <PostFeed
      eyebrow="D&K Dreams"
      title="개발과 일상을 기록합니다"
      posts={posts}
      emptyText="아직 작성된 글이 없습니다."
    />
  );
}
