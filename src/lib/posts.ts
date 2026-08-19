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

export type PostListItem = Awaited<ReturnType<typeof listPosts>>[number];
