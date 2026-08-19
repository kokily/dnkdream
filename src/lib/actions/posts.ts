"use server";

import { auth } from "@/auth";
import { slugifyTitle } from "../slug";
import { prisma } from "../db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPostAction(
  _prev: string | null,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user) {
    return "로그인이 필요합니다";
  }

  const category = String(formData.get("category") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const tagsValue = String(formData.get("tags") ?? "").trim();
  const thumbnail = String(formData.get("thumbnail") ?? "").trim();

  if (!category || !title || !body) {
    return "카테고리, 제목, 본문은 필수입니다";
  }

  const tags = tagsValue
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  let slug = slugifyTitle(title);
  const exists = await prisma.post.findUnique({ where: { slug } });

  if (exists) {
    slug = `${slug}-${crypto.randomUUID().slice(0, 6)}`;
  }

  const post = await prisma.post.create({
    data: {
      slug,
      category,
      title,
      body,
      thumbnail: thumbnail || null,
      tags: {
        connectOrCreate: tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath(`/category/${encodeURIComponent(category)}`);
  revalidatePath(`/post/${encodeURIComponent(post.slug)}`);

  redirect(`/post/${encodeURIComponent(post.slug)}`);
}
