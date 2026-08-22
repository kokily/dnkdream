import PageHeading from "@/components/site/page-heading";
import Image from "next/image";

export default function AboutContent() {
  return (
    <section className="mx-auto max-w-2xl">
      <PageHeading title="소개" />

      <div className="mt-10 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        <Image
          src="/assets/images/profile.jpg"
          alt="Hyunsung Kim"
          width={160}
          height={160}
          className="rounded-full object-cover"
          priority
        />

        <div className="min-w-0 text-center sm:text-left">
          <h2 className="text-2xl font-semibold tracking-tight">
            Hyunsung Kim
          </h2>
          <p className="mt-1 text-sm text-mint">@kokily</p>
          <p className="mt-4 text-neutral-600">
            I&apos;m not a Developer, but my hobby is development, mostly
            front-end
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
            <a
              href="https://github.com/kokily"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line px-3 py-1.5 text-sm hover:border-mint hover:text-mint"
            >
              GitHub
            </a>
            <a
              href="https://facebook.com/hkkokily5"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line px-3 py-1.5 text-sm hover:border-mint hover:text-mint"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
