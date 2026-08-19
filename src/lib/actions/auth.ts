"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";

export async function loginAction(_prev: string | null, formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length < 1) {
    return "비밀번호를 입력하세요.";
  }

  try {
    await signIn("credentials", {
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "비밀번호가 올바르지 않습니다.";
    }

    throw error;
  }

  redirect("/");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
