import LoginShell from "@/components/layout/login-shell";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LoginShell>{children}</LoginShell>;
}
