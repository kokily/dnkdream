import type { Metadata } from "next";
import AboutContent from "@/components/site/about-content";

export const metadata: Metadata = {
  title: "소개",
};

export default function AboutPage() {
  return <AboutContent />;
}
