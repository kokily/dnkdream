import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { formatDate } from "@/lib/shared/format-date";
import { renderMarkdownWithToc } from "@/lib/server/markdown-server";
import { getPostBySlug } from "@/lib/queries/posts";
import PostAdminActions from "@/components/post/post-admin-actions";
import PostToc from "@/components/post/post-toc";
import TagLink from "./tag-link";

type Post = NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>;

interface PostArticleProps {
  post: Post;
}

export default async function PostArticle({ post }: PostArticleProps) {
  const session = await auth();
  const { html, toc } = await renderMarkdownWithToc(post.body);
  const isAdmin = !!session?.user;

  return (
    <article className="relative mx-auto max-w-3xl">
      <p className="text-sm text-mint">
        <Link
          href={`/category/${encodeURIComponent(post.category)}`}
          className="hover:underline"
        >
          {post.category}
        </Link>
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-neutral-500">
        {formatDate(post.createdAt)}
        {isAdmin ? ` · 조회 ${post.viewCount.toLocaleString("ko-KR")}` : null}
      </p>

      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag.name}>
              <TagLink name={tag.name} />
            </li>
          ))}
        </ul>
      )}

      {isAdmin ? <PostAdminActions postId={post.id} /> : null}

      {post.thumbnail ? (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="xl:hidden">
        <PostToc items={toc} />
      </div>

      <div className="relative">
        <div
          className="markdown mt-10"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {toc.length > 0 ? (
          <div className="absolute top-0 left-full hidden h-full pl-8 xl:block">
            <div className="sticky top-20 w-52">
              <PostToc items={toc} aside />
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
