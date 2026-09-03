import "server-only";

import { prisma } from "@/lib/server/db";

const commentSelect = {
  id: true,
  username: true,
  body: true,
  deleted: true,
  createdAt: true,
  parentId: true,
} as const;

export async function listComments(postId: string) {
  return prisma.comment.findMany({
    where: { postId, parent: null },
    orderBy: { createdAt: "asc" },
    select: {
      ...commentSelect,
      replies: {
        orderBy: { createdAt: "asc" },
        select: commentSelect,
      },
    },
  });
}

export type CommentThread = Awaited<ReturnType<typeof listComments>>[number];
