import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import CommentSection from "@/components/comment/comment-section";
import PostArticle from "@/components/post/post-article";
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

  const description = post.body.replace(/\s+/g, " ").trim().slice(0, 80);
  const image = post.thumbnail
    ? [{ url: post.thumbnail, alt: post.title }]
    : [
        {
          url: "/logo512.png",
          width: 512,
          height: 512,
          alt: "D&K Dreams Blog",
        },
      ];

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      images: image,
    },
    twitter: {
      card: post.thumbnail ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: image.map((item) => item.url),
    },
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
