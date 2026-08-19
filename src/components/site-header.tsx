"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";

const navItems = [
  { href: "/", label: "글" },
  { href: "/about", label: "소개" },
];

function linkClass(active: boolean) {
  return active
    ? "text-mint-soft"
    : "text-white/80 transition-colors hover:text-white";
}

export default function SiteHeader({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal/95 text-white backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl tracking-wide transition-colors hover:text-mint-soft"
        >
          D&K Dreams
        </Link>

        <nav className="hidden items-center gap-6 text-sm sm:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(active)}
              >
                {item.label}
              </Link>
            );
          })}

          {isAdmin && (
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-white/80 transition-colors hover:text-white"
              >
                로그아웃
              </button>
            </form>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 sm:hidden"
          aria-label="메뉴 열기"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">메뉴</span>
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-4 bg-white" />
            <span className="block h-0.5 w-4 bg-white" />
            <span className="block h-0.5 w-4 bg-white" />
          </span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 py-3 sm:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-white/90"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {isAdmin && (
            <form action={logoutAction}>
              <button type="submit" className="block py-2 text-white/90">
                로그아웃
              </button>
            </form>
          )}
        </nav>
      )}
    </header>
  );
}
