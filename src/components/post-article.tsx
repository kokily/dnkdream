import { auth } from "@/auth";
import { formatDate } from "@/lib/format-date";
import { renderMarkdown } from "@/lib/markdown";
import { getPostBySlug } from "@/lib/posts";
import PostAdminActions from "@/components/post-admin-actions";
import Link from "next/link";
import TagLink from "./tag-link";

type Post = NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>;

export default async function PostArticle({ post }: { post: Post }) {
  const session = await auth();
  const html = renderMarkdown(post.body);

  return (
    <article className="mx-auto max-w-3xl">
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

      {session?.user ? <PostAdminActions postId={post.id} /> : null}

      <div
        className="markdown mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
