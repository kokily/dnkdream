import type { Metadata } from "next";
import DraftList from "@/components/draft-list";
import { listDrafts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "임시글",
};

export default async function DraftsPage() {
  const drafts = await listDrafts();

  return <DraftList drafts={drafts} />;
}
