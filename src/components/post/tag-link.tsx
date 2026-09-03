"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TagLinkProps {
  name: string;
}

export default function TagLink({ name }: TagLinkProps) {
  const pathname = usePathname();
  const href = `/tag/${encodeURIComponent(name)}`;
  const current = decodeURIComponent(pathname);
  const active = current === `/tag/${name}` || pathname === href;

  return (
    <Link
      href={active ? "/" : href}
      className={
        active
          ? "rounded-full bg-mint px-2.5 py-1 text-xs text-white"
          : "rounded-full bg-mint-soft/60 px-2.5 py-1 text-xs text-charcoal hover:bg-mint-soft"
      }
    >
      #{name}
      {active ? " ×" : ""}
    </Link>
  );
}
