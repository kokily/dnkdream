import type { Metadata } from "next";
import WriteForm from "@/components/write-form";

export const metadata: Metadata = {
  title: "글 작성",
};

export default function WritePage() {
  return <WriteForm />;
}
