import type { Metadata } from "next";
import { listAllCategories } from "@/lib/queries/posts";
import WriteForm from "@/components/write/write-form";

export const metadata: Metadata = {
  title: "글 작성",
};

export default async function WritePage() {
  const categories = await listAllCategories();

  return <WriteForm categories={categories} />;
}
