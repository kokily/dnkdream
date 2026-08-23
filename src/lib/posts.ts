import { prisma } from "./db";

export const PAGE_SIZE = 10;

const listInclude = {
  tags: {
    select: { name: true },
    orderBy: { name: "asc" as const },
  },
  _count: {
    select: {
      comments: {
        where: { deleted: false, parentId: null },
      },
    },
  },
};

export function pageFromSearchParams(page: string | string[] | undefined) {
  const raw = Array.isArray(page) ? page[0] : page;
  const value = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

export function queryFromSearchParams(query: string | string[] | undefined) {
  const raw = Array.isArray(query) ? query[0] : query;
  return (raw ?? "").trim();
}

async function listPublished(
  where: {
    publishedAt: { not: null };
    category?: string;
    tags?: { some: { name: string } };
  },
  page: number,
  query = "",
) {
  const filters = {
    ...where,
    ...(query
      ? { title: { contains: query, mode: "insensitive" as const } }
      : {}),
  };
  const total = await prisma.post.count({ where: filters });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(Math.max(page, 1), pageCount);

  const posts = await prisma.post.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
    skip: (current - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: listInclude,
  });

  return { posts, total, page: current, pageCount };
}

export async function listPosts(page = 1, query = "") {
  return listPublished({ publishedAt: { not: null } }, page, query);
}

export async function listPostsByCategory(
  category: string,
  page = 1,
  query = "",
) {
  return listPublished({ category, publishedAt: { not: null } }, page, query);
}

export async function listPostsByTag(name: string, page = 1, query = "") {
  const normalized = normalizeSlug(name);
  return listPublished(
    { tags: { some: { name: normalized } }, publishedAt: { not: null } },
    page,
    query,
  );
}

export async function listAllCategories() {
  const rows = await prisma.post.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  return rows.map((row) => row.category).filter(Boolean);
}

export async function listCategories() {
  const rows = await prisma.post.findMany({
    where: { publishedAt: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  return rows.map((row) => row.category);
}

export async function listTags() {
  const rows = await prisma.tag.findMany({
    where: { posts: { some: { publishedAt: { not: null } } } },
    select: { name: true },
    orderBy: { name: "asc" },
  });

  return rows.map((row) => row.name);
}

export async function listPublishedForSitemap() {
  return prisma.post.findMany({
    where: { publishedAt: { not: null } },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

export type PostListItem = Awaited<
  ReturnType<typeof listPosts>
>["posts"][number];

function normalizeSlug(slug: string) {
  try {
    return decodeURIComponent(slug).normalize("NFC");
  } catch {
    return slug.normalize("NFC");
  }
}

export async function getPostBySlug(slug: string) {
  const normalized = normalizeSlug(slug);

  return prisma.post.findUnique({
    where: { slug: normalized, publishedAt: { not: null } },
    include: {
      tags: {
        select: { name: true },
        orderBy: { name: "asc" },
      },
    },
  });
}

export async function listDrafts() {
  return prisma.post.findMany({
    where: { publishedAt: null },
    orderBy: { updatedAt: "desc" },
    include: {
      tags: {
        select: { name: true },
        orderBy: { name: "asc" },
      },
    },
  });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      tags: {
        select: { name: true },
        orderBy: { name: "asc" },
      },
    },
  });
}
