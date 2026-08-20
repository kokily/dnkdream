import { formatDate } from "@/lib/format-date";
import { renderMarkdown } from "@/lib/markdown";
import { getPostBySlug } from "@/lib/posts";

type Post = NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>;

export default async function PostArticle({ post }: { post: Post }) {
  const html = renderMarkdown(post.body);

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm text-mint">{post.category}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-neutral-500">
        {formatDate(post.createdAt)}
      </p>

      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag.name}
              className="rounded-full bg-mint-soft/60 px-2.5 py-1 text-xs text-charcoal"
            >
              #{tag.name}
            </li>
          ))}
        </ul>
      )}

      <div
        className="markdown mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
