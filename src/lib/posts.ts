import { prisma } from "./db";

export async function listPosts() {
  return prisma.post.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { createdAt: "desc" },
    include: {
      tags: {
        select: { name: true },
        orderBy: { name: "asc" },
      },
      _count: {
        select: {
          comments: {
            where: { deleted: false, parentId: null },
          },
        },
      },
    },
  });
}

export async function listPostsByCategory(category: string) {
  return prisma.post.findMany({
    where: { category, publishedAt: { not: null } },
    orderBy: { createdAt: "desc" },
    include: {
      tags: {
        select: { name: true },
        orderBy: { name: "asc" },
      },
      _count: {
        select: {
          comments: {
            where: { deleted: false, parentId: null },
          },
        },
      },
    },
  });
}

export async function listPostsByTag(name: string) {
  const normalized = normalizeSlug(name);

  return prisma.post.findMany({
    where: {
      tags: { some: { name: normalized } },
      publishedAt: { not: null },
    },
    orderBy: { createdAt: "desc" },
    include: {
      tags: {
        select: { name: true },
        orderBy: { name: "asc" },
      },
      _count: {
        select: {
          comments: {
            where: { deleted: false, parentId: null },
          },
        },
      },
    },
  });
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

export type PostListItem = Awaited<ReturnType<typeof listPosts>>[number];

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

// 임시저장: /write/drafts
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

// 임시저장: 에디터에서 글 다시 불러오기
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
