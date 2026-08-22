"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginForm() {
  const [error, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="w-full max-w-sm space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm text-neutral-600">비밀번호</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-line bg-white px-3 py-2 outline-none focus:border-mint"
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-charcoal px-4 py-2.5 text-white hover:bg-ink disabled:opacity-60"
      >
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
