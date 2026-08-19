import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "로그인",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return <LoginForm />;
}
