import type { Metadata } from "next";
import WriteForm from "@/components/write/write-form";
import { listAllCategories } from "@/lib/posts";

export const metadata: Metadata = {
  title: "글 작성",
};

export default async function WritePage() {
  const categories = await listAllCategories();

  return <WriteForm categories={categories} />;
}
