import WriteForm from "@/components/write/write-form";
import { getPostById, listAllCategories } from "@/lib/posts";
import { notFound } from "next/navigation";

export default async function EditWritePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getPostById(id),
    listAllCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return <WriteForm draft={post} categories={categories} />;
}
