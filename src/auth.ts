import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/server/db";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        password: { type: "password" },
      },
      async authorize(credentials) {
        const password = credentials?.password;

        if (typeof password !== "string" || password.length < 1) {
          return null;
        }

        const admin = await prisma.admin.findFirst();

        if (!admin) {
          return null;
        }

        const valid = await bcrypt.compare(password, admin.passwordHash);

        if (!valid) {
          return null;
        }

        return { id: admin.id };
      },
    }),
  ],
});
