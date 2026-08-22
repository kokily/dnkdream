import PageHeading from "@/components/site/page-heading";
import Link from "next/link";

export default function NotFoundContent() {
  return (
    <section className="mx-auto max-w-xl py-16 text-center">
      <PageHeading
        title="페이지를 찾을 수 없습니다"
        description="주소가 바뀌었거나, 글이 없거나 임시글일 수 있습니다."
      />
      <p className="mt-8">
        <Link
          href="/"
          className="inline-flex rounded-md border border-line px-4 py-2 text-sm hover:border-mint hover:text-mint"
        >
          글 목록으로
        </Link>
      </p>
    </section>
  );
}
