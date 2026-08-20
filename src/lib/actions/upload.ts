"use server";

import { auth } from "@/auth";
import { saveImage } from "../storage";

export async function uploadImageAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) return { error: "로그인이 필요합니다" };

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "파일이 없습니다" };
  }

  try {
    return { url: await saveImage(file) };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "업로드 실패",
    };
  }
}
