import { notFound } from "next/navigation";
import { getPostById, listAllCategories } from "@/lib/queries/posts";
import WriteForm from "@/components/write/write-form";

interface EditWritePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWritePage({ params }: EditWritePageProps) {
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
