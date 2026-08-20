import WriteForm from "@/components/write-form";
import { getPostById } from "@/lib/posts";
import { notFound } from "next/navigation";

export default async function EditWritePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return <WriteForm draft={post} />;
}
