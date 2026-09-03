import WriteShell from "@/components/layout/write-shell";

export default function WriteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <WriteShell>{children}</WriteShell>;
}
