import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import localFont from "next/font/local";
import Analytics from "@/components/site/analytics";
import "./globals.css";

const rajdhani = Rajdhani({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

const rokafMedium = localFont({
  src: "../fonts/ROKAF-Medium.ttf",
  variable: "--font-rokaf-medium",
  display: "swap",
});

const rokafBold = localFont({
  src: "../fonts/ROKAF-Bold.ttf",
  variable: "--font-rokaf-bold",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dnkdream.com"),
  title: {
    default: "D&K Dreams Blog",
    template: "%s | D&K Dreams Blog",
  },
  description: "개발과 일상을 기록하는 D&K Dreams 블로그",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  verification: {
    google: "8tl7dJru1oZk2hSD7Mhr0rpZ2QE68a15_C9Ny8JiBbQ",
    other: {
      "naver-site-verification": "8538c2d2cda20e8aedc196b49ba0f8ccc7b4dde0",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://dnkdream.com",
    siteName: "D&K Dreams Blog",
    title: "D&K Dreams Blog",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "D&K Dreams Blog",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${rajdhani.variable} ${rokafMedium.variable} ${rokafBold.variable}`}
    >
      <body className="min-h-dvh antialiased">{children}</body>
      <Analytics />
    </html>
  );
}
