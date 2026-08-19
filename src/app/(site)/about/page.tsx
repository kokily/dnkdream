import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개",
};

export default function AboutPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight">소개</h1>
      <p className="max-w-2xl text-neutral-600">
        소개 본문은 다음 단계에서 채우겠습니다.
      </p>
    </section>
  );
}
