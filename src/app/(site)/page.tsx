import PostCard from "@/components/post-card";
import { listPosts } from "@/lib/posts";

export default async function HomePage() {
  const posts = await listPosts();

  return (
    <section>
      <div className="space-y-3">
        <p className="text-sm font-medium text-mint">D&K Dreams</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          개발과 일상을 기록합니다
        </h1>
      </div>

      {posts.length === 0 ? (
        <p className="mt-12 text-neutral-500">아직 작성된 글이 없습니다.</p>
      ) : (
        <div className="mt-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
