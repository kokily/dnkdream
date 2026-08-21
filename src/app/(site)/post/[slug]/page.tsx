import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import CommentSection from "@/components/comment-section";
import PostArticle from "@/components/post-article";
import { listComments } from "@/lib/comments";
import { getPostBySlug } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "글을 찾을 수 없습니다" };
  }

  return {
    title: post.title,
    description: post.body.slice(0, 80),
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [comments, session] = await Promise.all([
    listComments(post.id),
    auth(),
  ]);

  return (
    <>
      <PostArticle post={post} />
      <CommentSection
        postId={post.id}
        comments={comments}
        isAdmin={!!session?.user}
      />
    </>
  );
}
