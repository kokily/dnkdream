import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/shared/format-date";
import { PostListItem } from "@/lib/queries/posts";
import { excerpt } from "@/lib/shared/excerpt";
import TagLink from "./tag-link";

interface PostCardProps {
  post: PostListItem;
  isAdmin?: boolean;
}

export default function PostCard({ post, isAdmin = false }: PostCardProps) {
  return (
    <article className="group grid gap-4 border-b border-line py-8 sm:grid-cols-[16rem_minmax(0,1fr)] sm:gap-6">
      <Link
        href={`/post/${post.slug}`}
        className="relative block aspect-video overflow-hidden rounded-xl bg-mint-soft/40"
      >
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            sizes="(min-width: 640px) 16rem, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-mint">
            D&K
          </span>
        )}
      </Link>

      <div className="min-w-0">
        <p className="text-sm text-mint">
          <Link
            href={`/category/${encodeURIComponent(post.category)}`}
            className="hover:underline"
          >
            {post.category}
          </Link>
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">
          <Link href={`/post/${post.slug}`} className="hover:text-mint">
            {post.title}
            {post._count.comments > 0 && (
              <span className="ml-2 text-sm font-medium text-neutral-500">
                {post._count.comments}
              </span>
            )}
          </Link>
        </h2>

        <p className="mt-2 line-clamp-2 text-neutral-600">
          {excerpt(post.body)}
        </p>
        {post.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag.name}>
                <TagLink name={tag.name} />
              </li>
            ))}
          </ul>
        )}

        <p className="mt-3 text-sm text-neutral-500">
          {formatDate(post.createdAt)}
          {isAdmin ? ` · 조회 ${post.viewCount.toLocaleString("ko-KR")}` : null}
        </p>
      </div>
    </article>
  );
}
