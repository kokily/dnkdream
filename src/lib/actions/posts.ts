"use server";

import { auth } from "@/auth";
import { slugifyTitle } from "../slug";
import { prisma } from "../db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function fields(formData: FormData) {
  return {
    id: String(formData.get("id") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    tags: parseTags(String(formData.get("tags") ?? "")),
    thumbnail: String(formData.get("thumbnail") ?? "").trim() || null,
  };
}

async function uniqueSlug(title: string, excludeId?: string) {
  let slug = slugifyTitle(title || "draft");
  const exists = await prisma.post.findFirst({
    where: {
      slug,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });

  if (exists) {
    slug = `${slug}-${crypto.randomUUID().slice(0, 6)}`;
  }

  return slug;
}

async function connectTags(tags: string[]) {
  return {
    connectOrCreate: tags.map((name) => ({
      where: { name },
      create: { name },
    })),
  };
}

// 임시저장: Ctrl+s / 임시저장 버튼, 발행하지 않음
export async function saveDraftAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return { error: "로그인이 필요합니다" };
  }

  const { id, category, title, body, tags, thumbnail } = fields(formData);
  const data = {
    category,
    title: title || "제목 없음",
    body,
    thumbnail,
    publishedAt: null,
  };

  if (id) {
    // 임시 저장: 이전 퍼블리싱 상태 확인
    const existing = await prisma.post.findUnique({ where: { id } });

    await prisma.post.update({
      where: { id },
      data: { ...data, tags: { set: [] } },
    });

    const post = await prisma.post.update({
      where: { id },
      data: { tags: await connectTags(tags) },
    });

    // 임시 저장: 퍼블리싱 -> Temp 홈/상세에서 바로 사라지게
    if (existing?.publishedAt) {
      revalidatePath("/");
      revalidatePath(`/category/${encodeURIComponent(existing.category)}`);
      revalidatePath(`/post/${encodeURIComponent(existing.slug)}`);
    }

    return { id: post.id, unpublished: !!existing?.publishedAt };
  }

  const post = await prisma.post.create({
    data: {
      ...data,
      slug: await uniqueSlug(title),
      tags: await connectTags(tags),
    },
  });

  return { id: post.id, unpublished: false };
}

export async function createPostAction(
  _prev: string | null,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user) {
    return "로그인이 필요합니다";
  }
  const { id, category, title, body, tags, thumbnail } = fields(formData);
  if (!category || !title || !body) {
    return "카테고리, 제목, 본문은 필수입니다";
  }
  const slug = await uniqueSlug(title, id || undefined);
  const payload = {
    slug,
    category,
    title,
    body,
    thumbnail,
    publishedAt: new Date(), // 임시저장: 이때만 공개
  };
  const post = id
    ? await prisma.post.update({
        where: { id },
        data: { ...payload, tags: { set: [] } },
      })
    : await prisma.post.create({
        data: { ...payload, tags: await connectTags(tags) },
      });
  if (id) {
    await prisma.post.update({
      where: { id: post.id },
      data: { tags: await connectTags(tags) },
    });
  }
  revalidatePath("/");
  revalidatePath(`/category/${encodeURIComponent(category)}`);
  revalidatePath(`/post/${encodeURIComponent(post.slug)}`);
  redirect(`/post/${encodeURIComponent(post.slug)}`);
}

// 임시저장: 미발행 글만 삭제
export async function deleteDraftAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return;
  }
  const id = String(formData.get("id") ?? "");
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.publishedAt) {
    return;
  }
  await prisma.post.delete({ where: { id } });
  revalidatePath("/write/drafts");
}

export async function deletePostAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const id = String(formData.get("id") ?? "");
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return;
  }

  await prisma.post.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath(`/category/${encodeURIComponent(post.category)}`);
  revalidatePath(`/post/${encodeURIComponent(post.slug)}`);
  redirect("/");
}
