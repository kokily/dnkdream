import WriteShell from "@/components/layout/write-shell";
import React from "react";

export default function WriteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <WriteShell>{children}</WriteShell>;
}
