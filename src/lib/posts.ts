import { prisma } from "./db";

export async function listPosts() {
  return prisma.post.findMany({
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
    where: { category },
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
  return prisma.post.findMany({
    where: {
      tags: { some: { name } },
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
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  return rows.map((row) => row.category);
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
    where: { slug: normalized },
    include: {
      tags: {
        select: { name: true },
        orderBy: { name: "asc" },
      },
    },
  });
}
