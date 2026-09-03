"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/server/db";
import { auth } from "@/auth";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function revalidatePost(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { slug: true },
  });

  if (post) {
    revalidatePath(`/post/${encodeURIComponent(post.slug)}`);
    revalidatePath("/");
  }
}

export async function createCommentAction(
  _prev: string | null,
  formData: FormData,
) {
  const postId = text(formData, "postId");
  const parentId = text(formData, "parentId") || null;
  const body = text(formData, "body");

  const session = await auth();

  if (!postId || !body) {
    return "내용을 입력하세요";
  }

  if (body.length > 2000) {
    return "댓글은 2000자 이하입니다";
  }

  const post = await prisma.post.findFirst({
    where: { id: postId, publishedAt: { not: null } },
  });

  if (!post) {
    return "글을 찾을 수 없습니다";
  }

  if (parentId) {
    const parent = await prisma.comment.findFirst({
      where: { id: parentId, postId, parent: null },
    });

    if (!parent) {
      return "원 댓글을 찾을 수 없습니다";
    }
  }

  let username = text(formData, "username");
  let password = text(formData, "password");

  if (session?.user) {
    username = "관리자";
    password = crypto.randomUUID();
  }

  if (!username || username.length > 20) {
    return "이름은 1~20자입니다";
  }

  if (!session?.user && password.length < 4) {
    return "비밀번호는 4자 이상입니다";
  }

  await prisma.comment.create({
    data: {
      postId,
      parentId,
      username,
      body,
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  await revalidatePost(postId);
  return null;
}

export async function deleteCommentAction(formData: FormData) {
  const id = text(formData, "id");
  const password = text(formData, "password");

  const session = await auth();
  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment || comment.deleted) {
    return;
  }

  if (!session?.user) {
    if (password.length < 4) {
      return;
    }

    const ok = await bcrypt.compare(password, comment.passwordHash);

    if (!ok) {
      return;
    }
  }

  await prisma.comment.update({
    where: { id },
    data: { deleted: true, body: "" },
  });

  await revalidatePost(comment.postId);
}
