import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isWrite = nextUrl.pathname.startsWith("/write");

      if (isWrite) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
