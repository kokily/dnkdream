import type { Metadata } from "next";
import { listDrafts } from "@/lib/queries/posts";
import DraftList from "@/components/write/draft-list";

export const metadata: Metadata = {
  title: "임시글",
};

export default async function DraftsPage() {
  const drafts = await listDrafts();

  return <DraftList drafts={drafts} />;
}
